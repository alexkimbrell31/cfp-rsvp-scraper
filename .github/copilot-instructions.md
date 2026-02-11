# CFP RSVP Scraper - AI Coding Agent Instructions

## Project Overview
A College Football Playoff (CFP) ticket price monitoring system that scrapes RSVP marketplace prices, tracks historical data, and triggers price drop alerts. Currently in early scraping phase with plans to add database persistence, analytics, and notifications.

## Architecture & Data Flow

**Current Stage:** Web scraping foundation
- **Input**: Static HTML files in `cfp-rsvp-html/` (downloaded RSVP marketplace pages)
- **Scraping**: Parse HTML to extract team names and ticket prices by level (100/300)
- **Output**: Console logging and structured JSON objects
- **Future**: Database persistence → price change detection → notifications (email/Discord)

**Key Files & Responsibilities:**
- [getRSVPPrice.js](cfp-rsvp-html/scripts/getRSVPPrice.js) - Core extraction logic; regex-based HTML parsing for prices
- [scrapeWebsite.js](cfp-rsvp-html/scripts/scrapeWebsite.js) - Fetch URLs and extract page titles (template for future live scraping)
- [PROJECT_BREAKDOWN.md](cfp-rsvp-html/gameplan/PROJECT_BREAKDOWN.md) - Detailed implementation roadmap with 4 phases

## Parsing Conventions & Patterns

**HTML Structure** (from team pages):
```html
<title>Team Name - 2026...</title>
<div>100 Level - as low as $5,000.00</div>
<div>300 Level - as low as $3,500.00</div>
```

**Regex Pattern for Prices:**
```javascript
const levelRegex = /(\d{3}\s+Level)\s*-\s*as low as \$([0-9,]+\.\d{2})/g;
```
- Extracts level identifier (`100 Level`, `300 Level`) and price as float
- Removes commas before parsing to float

**Data Structure:**
```javascript
{
  team: "String",
  timestamp: "ISO 8601",
  prices: [
    { level: "100 Level", price: 5000.00 },
    { level: "300 Level", price: 3500.00 }
  ]
}
```

## Development Workflows

**Running Scrapers:**
```bash
# Scrape all team pages (auto-discovers teampage*.html)
node cfp-rsvp-html/scripts/getRSVPPrice.js

# Scrape specific directory
node cfp-rsvp-html/scripts/getRSVPPrice.js /path/to/htmldir

# Test title scraper (requires URL)
node cfp-rsvp-html/scripts/scrapeWebsite.js https://example.com
```

**Dependencies:**
- `cheerio` (^1.2.0) - HTML parsing for live scraping
- `axios` (^1.13.4) - HTTP requests
- `@types/node` (^25.1.0) - TypeScript types (dev only)

## Critical Patterns & Conventions

**File Discovery:**
- Script auto-detects all `teampage*.html` files via regex: `/^teampage\d+\.html$/`
- Files are sorted numerically (teampage1, teampage2, etc.) before processing

**Error Handling:**
- Gracefully handle missing HTML elements (returns `null` from scraper, continues to next file)
- Console logging uses `console.error()` for failures, `console.warn()` for edge cases
- No throwing exceptions - functions return `null` on errors

**Import Style:**
- ESM imports (`import X from 'y'`) throughout
- Node path utilities: `path`, `fs`, `fileURLToPath` for cross-platform compatibility

## Roadmap & Next Phases

1. **Phase 2 - Database Storage**: SQLite (simplicity) or PostgreSQL (scale); persist price + timestamp
2. **Phase 3 - Alerts**: Configure thresholds (>20%, >30% drops), rolling averages, cooldown debouncing
3. **Phase 4 - Notifications**: Email (Gmail SMTP) + Discord webhook (free options)

See [PROJECT_BREAKDOWN.md](../gameplan/PROJECT_BREAKDOWN.md) for detailed task lists per phase.

## Common Gotchas

- **HTML Structure Changes**: Regex patterns are brittle; monitor for marketplace HTML updates
- **Numeric Price Parsing**: Always remove commas before `parseFloat()`
- **File Sorting**: Use numeric sort, not alphabetic (teampage10 must come after teampage9)
- **Timestamp Accuracy**: All scrapes include `.toISOString()` timestamp for later comparison logic
