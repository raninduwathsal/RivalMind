import OpenAI from 'openai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

const SYSTEM_PROMPT = `
You are an expert Competitive Intelligence Analyst. 
I will provide you with the raw text extracted from a competitor's website. 
Your goal is to extract key intelligence and return it strictly as a JSON object matching the following schema.
If you cannot find the exact data, make an educated guess or return "Unknown" / false.

Expected JSON format:
{
  "features": {
    "discovery": boolean,
    "ragChat": boolean,
    "stealthEvasion": boolean,
    "apiAccess": boolean
  },
  "market": {
    "g2Rating": "string (e.g. 4.8/5)",
    "sentiment": "string (e.g. Positive (+15%))"
  },
  "social": {
    "shareOfVoice": "string",
    "redditMomentum": "string",
    "blogStrategy": "string",
    "communityGrowth": "string"
  },
  "gtm": {
    "audience": "string (e.g. Enterprise, SMB)",
    "salesMotion": "string (e.g. PLG, Sales-Led)",
    "freeTrial": "string (e.g. 14-Day Trial, None)"
  },
  "ecosystem": {
    "integrations": "string (e.g. Slack, Teams)"
  },
  "resources": {
    "funding": "string",
    "employees": "string",
    "deployment": "string",
    "hiringVelocity": "string"
  },
  "compliance": {
    "soc2": boolean,
    "gdpr": boolean,
    "hipaa": boolean
  },
  "pricing": "string (e.g. $49/mo)"
}

Ensure the output is ONLY valid JSON, with no markdown code blocks or additional text.
`;

export async function parseCompetitorData(rawText: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Extract intelligence from the following scraped content:\n\n${rawText.slice(0, 15000)}` }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content received from DeepSeek");
    
    return JSON.parse(content);
  } catch (error) {
    console.error("DeepSeek Extraction Failed:", error);
    throw error;
  }
}
