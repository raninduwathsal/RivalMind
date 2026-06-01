import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

puppeteer.use(StealthPlugin());

export async function scrapeSocial(url: string, platform: 'linkedin' | 'twitter' | 'youtube') {
  let browser;
  try {
    console.log(`[Social Scraper] Booting headless browser for ${platform}: ${url}`);
    
    const disableProxies = process.env.DISABLE_PROXIES === 'true';
    
    // For social scraping, we use ISP proxies (static IPs) to avoid session bans
    const proxyIp = process.env.TORCH_ISP_PROXY_IP;
    const proxyPort = process.env.TORCH_ISP_PROXY_PORT;
    const proxyUsername = process.env.TORCH_ISP_PROXY_USERNAME;
    const proxyPassword = process.env.TORCH_ISP_PROXY_PASSWORD;

    const launchArgs = ['--no-sandbox', '--disable-setuid-sandbox'];

    if (!disableProxies && proxyIp && proxyPort) {
      const proxyUrl = `http://${proxyIp}:${proxyPort}`;
      console.log(`[Social Scraper] Routing through ISP proxy: ${proxyUrl}`);
      launchArgs.push(`--proxy-server=${proxyUrl}`);
    } else if (!disableProxies) {
      console.warn(`[Social Scraper] ISP Proxy credentials not found! Proceeding without proxy. This is risky for authenticated sessions.`);
    } else {
      console.log(`[Social Scraper] Proxies DISABLED via env variable.`);
    }

    browser = await puppeteer.launch({
      headless: true,
      args: launchArgs
    });

    const page = await browser.newPage();
    
    if (!disableProxies && proxyUsername && proxyPassword) {
      await page.authenticate({
        username: proxyUsername,
        password: proxyPassword
      });
    }
    
    await page.setViewport({ width: 1280, height: 800 });

    console.log(`[Social Scraper] Navigating to ${url}...`);
    // Wait until network is somewhat idle for social sites which load lots of dynamic content
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    
    // Scroll down to load lazy content (comments, feeds)
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if(totalHeight >= scrollHeight - window.innerHeight || totalHeight > 3000){
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    // Extract text content and any video tags
    const extraction = await page.evaluate(() => {
      const videos = Array.from(document.querySelectorAll('video')).map(v => v.src);
      return {
        rawText: document.body.innerText,
        videosFound: videos
      };
    });

    return {
      url: url,
      platform: platform,
      extractedLength: extraction.rawText.length,
      rawText: extraction.rawText,
      videos: extraction.videosFound
    };

  } catch (error) {
    console.error(`[Social Scraper] Failed to scrape ${url}:`, error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      console.log(`[Social Scraper] Browser instance closed.`);
    }
  }
}
