import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import { scrapeTarget } from '../scraper/stealth.js';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Generic web search tool using Serper
async function searchWeb(query: string) {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return JSON.stringify([{ title: "Mock", link: "https://mock.com", snippet: "Mock data because no API key." }]);

  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: query })
    });
    const data: any = await response.json();
    return JSON.stringify(data.organic ? data.organic.slice(0, 5).map((r: any) => ({ title: r.title, link: r.link, snippet: r.snippet })) : []);
  } catch (error) {
    return "Error performing search";
  }
}

// Scrape URL tool
async function scrapeUrl(url: string) {
  try {
    const res = await scrapeTarget(url);
    return res.rawText ? res.rawText.slice(0, 8000) : "No text found.";
  } catch (error) {
    return "Failed to scrape URL.";
  }
}

export async function runInvestigatorAgent(companyName: string, onProgress: (msg: string) => void) {
  onProgress(`Starting investigation on: ${companyName}`);
  
  // Fetch existing metric keys to encourage apples-to-apples comparison
  let existingMetricsHint = "";
  try {
    const { data } = await supabase.from('competitors').select('metrics');
    if (data && data.length > 0) {
      const keys = new Set<string>();
      data.forEach((row: any) => {
        if (row.metrics) Object.keys(row.metrics).forEach(k => keys.add(k));
      });
      if (keys.size > 0) {
        existingMetricsHint = `\nIMPORTANT: The current competitive matrix tracks the following metrics for other companies: ${Array.from(keys).join(', ')}. 
Please prioritize finding data for these specific categories so we can compare them directly. You may also add new categories if you find something uniquely important.`;
      }
    }
  } catch (e) {
    // Ignore db errors, just proceed without hint
  }

  const systemPrompt = `You are an elite competitive intelligence investigator.
Your goal is to investigate the company "${companyName}". 
You must search the web, find their main site, their pricing, their social media momentum on Reddit/Twitter/LinkedIn, and recent news.
Then, dynamically synthesize a fully structured JSON payload containing metrics you deem important based on your findings.${existingMetricsHint}

Additionally, if the company offers SaaS packages, menu items, or ecommerce products, you must extract these as a separate catalog/array so we can compare their products side-by-side.

You have access to tools to search the web and scrape URLs. Use them to gather intel.
IMPORTANT: You have up to 30 steps to investigate. Go down rabbit holes. Explore Reddit threads, look at their team, and find deep strategic intel.
When you are completely satisfied with your deep dive, call the "submit_findings" tool to submit your final JSON metrics.`;

  let messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Begin investigation for ${companyName}.` }
  ];

  const tools: OpenAI.Chat.ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "search_web",
        description: "Search Google for footprints, news, and context.",
        parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] }
      }
    },
    {
      type: "function",
      function: {
        name: "scrape_url",
        description: "Scrape the full text content from a specific webpage.",
        parameters: { type: "object", properties: { url: { type: "string" } }, required: ["url"] }
      }
    },
    {
      type: "function",
      function: {
        name: "submit_findings",
        description: "Submit the final synthesized competitive metrics and product catalog.",
        parameters: { 
          type: "object", 
          properties: { 
            metrics: { 
              type: "object", 
              description: "A flat or nested JSON object containing all the discovered metrics and intelligence."
            },
            products: {
              type: "array",
              description: "An array of product objects (e.g., SaaS tiers, menu items). Each object should have a 'name', 'price', and 'features'/'description'. Leave empty if none found.",
              items: { type: "object", additionalProperties: true }
            }
          }, 
          required: ["metrics"] 
        }
      }
    }
  ];

  let iterations = 0;
  const maxIterations = 30;

  while (iterations < maxIterations) {
    iterations++;
    onProgress(`Thinking (Step ${iterations}/${maxIterations})...`);

    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages,
      tools,
      temperature: 0.1,
    });

    const message = response.choices[0].message;
    messages.push(message);

    if (message.content) {
      onProgress(`Thought: ${message.content}`);
    }

    if (message.tool_calls && message.tool_calls.length > 0) {
      for (const toolCall of message.tool_calls) {
        const args = JSON.parse(toolCall.function.arguments);
        
        if (toolCall.function.name === 'submit_findings') {
          onProgress(`Investigation complete!`);
          
          // Inject products into metrics so it saves cleanly to the JSONB column
          const finalMetrics = args.metrics || {};
          if (args.products && Array.isArray(args.products) && args.products.length > 0) {
            finalMetrics._products = args.products;
          }
          
          return finalMetrics;
        }

        let toolOutput = "";
        if (toolCall.function.name === 'search_web') {
          onProgress(`Action: Searching web for "${args.query}"`);
          toolOutput = await searchWeb(args.query);
        } else if (toolCall.function.name === 'scrape_url') {
          onProgress(`Action: Scraping URL "${args.url}"`);
          toolOutput = await scrapeUrl(args.url);
        }

        onProgress(`Observation received for ${toolCall.function.name}.`);
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: toolOutput
        });
      }
    } else {
      // If no tool calls, force quit
      onProgress(`Agent stopped calling tools. Synthesizing available data.`);
      return { Note: "Agent stopped early", RawOutput: message.content };
    }
  }

  onProgress(`Max iterations reached. Force quitting.`);
  return { status: "incomplete", note: "Hit iteration limit before finishing." };
}
