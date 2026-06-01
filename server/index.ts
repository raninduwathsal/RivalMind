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

app.listen(PORT, () => {
  console.log(`[Server] RivalMind Backend running on port ${PORT}`);
});
