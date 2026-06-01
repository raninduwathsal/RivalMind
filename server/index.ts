import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { scrapeTarget } from './scraper/stealth.js';
import { scrapeSocial } from './scraper/social_scraper.js';
import { discoverFootprint } from './discovery.js';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- API Endpoints ---

// 1. Trigger Discovery
app.post('/api/discover', async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: 'Domain is required' });
    
    const result = await discoverFootprint(domain);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Trigger Standard Web Scraping (Premium Residential Proxies)
app.post('/api/scrape/web', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    
    const result = await scrapeTarget(url);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Trigger Social Media Scraping (ISP Proxies)
app.post('/api/scrape/social', async (req, res) => {
  try {
    const { url, platform } = req.body;
    if (!url || !platform) return res.status(400).json({ error: 'URL and platform are required' });
    
    const result = await scrapeSocial(url, platform as 'linkedin' | 'twitter' | 'youtube');
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 4. Strategy RAG Query endpoint
app.post('/api/rag/query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ answer: 'Mock Mode: Gemini API Key missing. You should highlight our easier onboarding.' });
    }

    // 1. Embed the query
    const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const embedResult = await embeddingModel.embedContent(query);
    const queryEmbedding = embedResult.embedding.values;

    // 2. Query Supabase vector store
    const { data: matches, error } = await supabase.rpc('match_competitor_embeddings', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 5
    });

    if (error) throw error;

    const contextText = matches?.map((m: any) => `Source: ${m.source}\nContent: ${m.content}`).join('\n\n') || 'No direct context found.';

    // 3. Generate answer using Gemini 1.5 Pro/Flash
    const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are the Rival Mind Strategy RAG Assistant. 
Answer the user's question based strictly on the provided intelligence context below.
If the context doesn't have the answer, say so.

Context:
${contextText}

User Query: ${query}`;

    const result = await chatModel.generateContent(prompt);
    const answer = result.response.text();

    res.json({ answer, contextUsed: matches });
  } catch (error: any) {
    console.error('[RAG Query] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Server] RivalMind Backend running on port ${PORT}`);
});
