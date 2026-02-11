import axios from 'axios';
import { load } from 'cheerio';

/**
 * Scrapes the title from a given URL
 * @param {string} url - The URL to scrape
 * @returns {Promise<string>} The page title
 */
async function scrapePageTitle(url) {
  try {
    // Fetch the HTML content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    // Parse HTML with cheerio
    const $ = load(response.data);

    // Extract title
    const title = $('title').text();

    if (!title) {
      console.warn('No title found on page');
      return null;
    }

    return title;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return null;
  }
}

// Main execution
const url = process.argv[2] || 'https://cfp-rsvp.com/home';

console.log(`Scraping title from: ${url}\n`);

const title = await scrapePageTitle(url);

if (title) {
  console.log('Page Title:');
  console.log('===========');
  console.log(title);
} else {
  console.log('Failed to retrieve title');
}

export default scrapePageTitle;