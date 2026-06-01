import fetch from 'node-fetch'; // Assumes node fetch is available or running in modern Node

// Discovery Engine Logic
export async function discoverFootprint(domain: string) {
  console.log(`[Discovery] Initiating fan-out search for ${domain}...`);
  
  const apiKey = process.env.SERPER_API_KEY;
  const queries = [
    `site:linkedin.com/jobs "${domain}"`,
    `site:github.com "${domain}"`,
    `site:youtube.com "${domain}"`
  ];

  if (!apiKey) {
    console.warn('[Discovery] SERPER_API_KEY not found. Falling back to mock discovery data.');
    const results = queries.map(q => ({ query: q, linksFound: Math.floor(Math.random() * 50) + 10 }));
    return {
      domain,
      status: 'mock_success',
      totalLinks: results.reduce((acc, curr) => acc + curr.linksFound, 0),
      breakdown: results
    };
  }

  try {
    const results = await Promise.all(queries.map(async (q) => {
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ q })
      });
      const data: any = await response.json();
      return {
        query: q,
        linksFound: data.organic ? data.organic.length : 0,
        topLinks: data.organic ? data.organic.slice(0, 3).map((res: any) => res.link) : []
      };
    }));

    return {
      domain,
      status: 'success',
      totalLinks: results.reduce((acc, curr) => acc + curr.linksFound, 0),
      breakdown: results
    };
  } catch (error) {
    console.error('[Discovery] API request failed:', error);
    throw error;
  }
}
