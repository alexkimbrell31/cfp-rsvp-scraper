# CFP RSVP Scraper

## Overview
- Repository scrapes static copies of CFP-RSVP marketplace pages in `cfp-rsvp-html/` to extract team names and ticket prices by level.
- Current output is console logs and structured JSON-like objects intended for later storage and alerting.
- Design notes, conventions, and roadmap are in `cfp-rsvp-html/gameplan/PROJECT_BREAKDOWN.md` and `.github/copilot-instructions.md`.

## Quick start
- Install dependencies:
```bash
npm install
```
- Run the main price scraper (auto-discovers `teampage*.html`):
```bash
node cfp-rsvp-html/scripts/getRSVPPrice.js
```
- Test the title fetcher:
```bash
node cfp-rsvp-html/scripts/scrapeWebsite.js https://example.com
```
- Optional: run the simple scheduler that calls the title scraper every 60s:
```bash
node cfp-rsvp-html/scripts/scheduleScraper.js
```

## What the scraper extracts
- Input files: `cfp-rsvp-html/teampage*.html` (numeric-sorted; `teampage10` after `teampage9`).
- Price parsing: regex-based extraction with comma-stripping before `parseFloat()`.
- Example data shape:
```json
{
  "team": "String",
  "timestamp": "2026-02-07T12:34:56.789Z",
  "prices": [
    { "level": "100 Level", "price": 5000.00 },
    { "level": "300 Level", "price": 3500.00 }
  ]
}
```

## Important files
- Core extraction: `cfp-rsvp-html/scripts/getRSVPPrice.js`
- Fetch/title helper: `cfp-rsvp-html/scripts/scrapeWebsite.js`
- Scheduler (example): `cfp-rsvp-html/scripts/scheduleScraper.js`
- Static HTML inputs: files under `cfp-rsvp-html/` (e.g., `teampage1.html`, `teampage2.html`, ...)
- Project plan: `cfp-rsvp-html/gameplan/PROJECT_BREAKDOWN.md`
- Repo guidance: `.github/copilot-instructions.md`
- Package config: `package.json`

## Conventions & gotchas
- ESM import style and Node path utilities are used throughout.
- File discovery uses the regex `/^teampage\d+\.html$/` and numeric sorting.
- Regex-based parsing is brittle; prefer Cheerio/DOM parsing for live scraping when possible.
- Always remove commas from currency strings before parsing to float.
- Respect `robots.txt` and a site's Terms of Service; setting a browser `User-Agent` does not make it ethically permissible to ignore site rules.

## Next phases (roadmap)
- Persist scraped data to a database (SQLite suggested).
- Implement price-change detection and alert rules (thresholds, cooldowns).
- Add notifications (email, Discord webhook).
- Add a scheduler/process manager (cron, PM2) with configurable intervals and blackout hours.

## Want help?
Tell me which of the following you'd like next:
- Save this to `README.md`
- Add a usage example with sample output
- Add a `package.json` script for starting the scheduler
