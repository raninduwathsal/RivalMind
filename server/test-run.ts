import { discoverFootprint } from './discovery.js';
import { scrapeTarget } from './scraper/stealth.js';
import { parseCompetitorData } from './ai/deepseek.js';

async function main() {
  const target = process.argv[2] || 'acmecorp.com';
  let targetUrl = target;
  if (!targetUrl.startsWith('http')) {
    targetUrl = `https://${targetUrl}`;
  }
  
  console.log(`\n=================================================`);
  console.log(`🚀 RIVALMIND INTELLIGENCE ENGINE: INITIALIZING`);
  console.log(`=================================================\n`);

  // Step 1: Discovery (Still mocked for now to focus on extraction)
  console.log(`[Discovery] Initiating fan-out search for ${target}...`);
  const discoveryResults = await discoverFootprint(target);
  console.log(`[Discovery] Found ${discoveryResults.totalLinks} potential intelligence nodes across the web.\n`);

  // Step 2: Live Scraping with Puppeteer Stealth
  console.log(`[Scraper] Booting stealth collection sequence...`);
  const scrapeData = await scrapeTarget(targetUrl);
  console.log(`[Scraper] Retrieved ${scrapeData.extractedLength} characters of raw text from ${scrapeData.url}.\n`);

  // Step 3: DeepSeek AI Parsing
  console.log(`[AI Engine] Sending ${scrapeData.extractedLength} chars to DeepSeek (v4 equivalent) for structured extraction...`);
  const startTime = Date.now();
  const structuredData = await parseCompetitorData(scrapeData.rawText);
  const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log(`[AI Engine] DeepSeek extraction completed in ${timeTaken}s.\n`);
  
  console.log(`\n=== EXTRACTED BATTLECARD JSON ===\n`);
  console.log(JSON.stringify(structuredData, null, 2));

  console.log(`\n=================================================`);
  console.log(`✅ OPERATION COMPLETE. DATA READY FOR SUPABASE.`);
  console.log(`=================================================\n`);
}

main().catch(console.error);
