import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Scrapes RSVP prices from CFP-RSVP HTML file
 * @param {string} htmlFilePath - Path to the HTML file
 * @returns {object} Object containing team name and price levels
 */
function scrapeRsvpPrices(htmlFilePath) {
  try {
    // Read the HTML file
    const html = fs.readFileSync(htmlFilePath, 'utf8');
    
    // Extract team name from title
    const titleMatch = html.match(/<title>(.*?)\s*-\s*2026/);
    const teamName = titleMatch ? titleMatch[1] : 'Unknown';
    
    // Extract level names and prices
    const levelRegex = /(\d{3}\s+Level)\s*-\s*as low as \$([0-9,]+\.\d{2})/g;
    const levels = [];
    
    let match;
    while ((match = levelRegex.exec(html)) !== null) {
      levels.push({
        level: match[1],
        price: parseFloat(match[2].replace(/,/g, ''))
      });
    }
    
    return {
      team: teamName,
      timestamp: new Date().toISOString(),
      prices: levels
    };
  } catch (error) {
    console.error(`Error scraping ${htmlFilePath}:`, error.message);
    return null;
  }
}

/**
 * Scrapes all team HTML files matching the teampage pattern in the directory
 * @param {string} htmlDir - Directory containing HTML files
 * @returns {array} Array of scraped data for all teams
 */
function scrapeAllTeams(htmlDir) {
  const results = [];
  
  try {
    // Find all files matching the teampage*.html pattern
    const files = fs.readdirSync(htmlDir).filter(file => 
      /^teampage\d+\.html$/.test(file)
    );
    
    // Sort files numerically (teampage1.html, teampage2.html, etc.)
    files.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });
    
    console.log(`Found ${files.length} team pages to scrape\n`);
    
    // Scrape each file
    files.forEach(file => {
      const filePath = path.join(htmlDir, file);
      const result = scrapeRsvpPrices(filePath);
      
      if (result) {
        results.push(result);
      }
    });
    
  } catch (error) {
    console.error('Error reading directory:', error.message);
  }
  
  return results;
}

// Main execution
const htmlDirectory = process.argv[2] 
  ? path.resolve(process.argv[2]) 
  : path.join(__dirname, '..');

console.log(`Scraping HTML files from: ${htmlDirectory}\n`);

const allResults = scrapeAllTeams(htmlDirectory);

if (allResults.length > 0) {
  console.log('='.repeat(60));
  console.log('CFP-RSVP PRICE SCRAPER - ALL TEAMS');
  console.log('='.repeat(60));
  console.log(`Scraped at: ${allResults[0].timestamp}\n`);
  
  allResults.forEach((result, index) => {
    console.log(`\n[${index + 1}] ${result.team}`);
    console.log('-'.repeat(40));
    
    if (result.prices.length > 0) {
      result.prices.forEach(item => {
        console.log(`  ${item.level}: $${item.price.toFixed(2)}`);
      });
    } else {
      console.log('  No price data found');
    }
  });
  
  // Summary table
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY TABLE');
  console.log('='.repeat(60));
  console.log('Team'.padEnd(20) + '100 Level'.padEnd(15) + '300 Level'.padEnd(15));
  console.log('-'.repeat(60));
  
  allResults.forEach(result => {
    const level100 = result.prices.find(p => p.level.includes('100')) || { price: 'N/A' };
    const level300 = result.prices.find(p => p.level.includes('300')) || { price: 'N/A' };
    
    const price100 = typeof level100.price === 'number' ? `$${level100.price.toFixed(2)}` : level100.price;
    const price300 = typeof level300.price === 'number' ? `$${level300.price.toFixed(2)}` : level300.price;
    
    console.log(result.team.substring(0, 19).padEnd(20) + price100.padEnd(15) + price300.padEnd(15));
  });
  
  console.log('='.repeat(60));
} else {
  console.log('No results found');
}

export default scrapeRsvpPrices;