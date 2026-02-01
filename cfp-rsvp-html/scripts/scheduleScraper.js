import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INTERVAL_MS = 60 * 1000; // 60 seconds

/**
 * Runs the scraper every 60 seconds
 */
function startScheduledScraper() {
  console.log(`Starting scheduled scraper (runs every 60 seconds)\n`);

  // Run immediately on start
  runScraper();

  // Then run every 60 seconds
  setInterval(runScraper, INTERVAL_MS);
}

function runScraper() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Running scraper...`);

  try {
    const scraperPath = join(__dirname, 'scrapeWebsite.js');
    execSync(`node ${scraperPath}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error running scraper:`, error.message);
  }

  console.log('');
}

startScheduledScraper();
