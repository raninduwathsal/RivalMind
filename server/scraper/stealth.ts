import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Configure puppeteer to use stealth plugin
puppeteer.use(StealthPlugin());

export async function scrapeTarget(url: string) {
  let browser;
  try {
    console.log(`[Stealth Scraper] Booting headless browser for ${url}`);
    
    // Configure proxy if not disabled
    const disableProxies = process.env.DISABLE_PROXIES === 'true';
    const proxyHost = process.env.TORCH_PROXY_HOST || 'proxy.torchlabs.xyz';
    const proxyPort = process.env.TORCH_PROXY_PORT || '9000';
    const proxyUrl = `http://${proxyHost}:${proxyPort}`;

    const launchArgs = ['--no-sandbox', '--disable-setuid-sandbox'];
    if (!disableProxies) {
      console.log(`[Stealth Scraper] Routing through proxy: ${proxyUrl}`);
      launchArgs.push(`--proxy-server=${proxyUrl}`);
    } else {
      console.log(`[Stealth Scraper] Proxies DISABLED via env variable.`);
    }

    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: launchArgs
    });

    const page = await browser.newPage();
    
    // Set proxy authentication if needed
    if (!disableProxies && process.env.TORCH_PROXY_USERNAME && process.env.TORCH_PROXY_PASSWORD) {
      await page.authenticate({
        username: process.env.TORCH_PROXY_USERNAME,
        password: process.env.TORCH_PROXY_PASSWORD
      });
    }
    
    // Set realistic viewport
    await page.setViewport({ width: 1280, height: 800 });

    console.log(`[Stealth Scraper] Navigating to ${url}...`);
    // Navigate to URL and wait for DOM content to load
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for a short random delay to mimic human reading and let SPA render
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    console.log(`[Stealth Scraper] Extracting DOM text content...`);
    
    // Extract innerText from the body, which effectively strips HTML tags and scripts
    const textContent = await page.evaluate(() => {
      return document.body.innerText;
    });

    return {
      url: url,
      extractedLength: textContent.length,
      rawText: textContent
    };

  } catch (error) {
    console.error(`[Stealth Scraper] Failed to scrape ${url}:`, error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      console.log(`[Stealth Scraper] Browser instance closed.`);
    }
  }
}
