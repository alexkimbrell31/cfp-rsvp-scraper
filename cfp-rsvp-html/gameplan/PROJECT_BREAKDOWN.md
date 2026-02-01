# CFP RSVP Price Tracker - Project Breakdown

## Project Overview
A real-time monitoring system for College Football Playoff (CFP) RSVP marketplace prices with historical tracking, statistical analysis, and instant notifications for significant price drops.

---

## Core Components

### 1. **Web Scraping & Data Collection**
**Goal:** Periodically fetch current RSVP prices from the marketplace

**Tasks:**
- [ ] Develop scraper for all team pages (`teampage*.html`)
- [ ] Extract: team name, 100 Level price, 300 Level price, timestamp
- [ ] Handle edge cases (missing data, network errors, HTML structure changes)
- [ ] Create scheduler to run scraper at configurable intervals (1-10 minutes)
- [ ] Add retry logic and error handling
- [ ] Log scraping operations (success/failure, timestamp, data collected)

**Deliverables:**
- Enhanced `getRSVPPrice.js` with scheduling capability
- Error handling and logging module
- Configuration file for scraping intervals

---

### 2. **Database & Historical Data Storage**
**Goal:** Persist price history for trend analysis and change detection

**Tasks:**
- [ ] Choose database (SQLite for simplicity, PostgreSQL for scalability)
- [ ] Design schema for storing:
  - Team name
  - Price level (100/300)
  - Price value
  - Timestamp
  - Price change percentage
- [ ] Create functions to insert scraped data
- [ ] Create query functions to retrieve historical data
- [ ] Add data retention policy (keep data for full season)
- [ ] Implement indexes for fast queries

**Deliverables:**
- Database schema design document
- Database initialization script
- Data access layer/ORM functions

---

### 3. **Price Change Detection & Alerts**
**Goal:** Identify significant price drops and trigger notifications

**Tasks:**
- [ ] Define "significant drop" thresholds (e.g., >20%, >30%, >50%)
- [ ] Compare current price to previous price
- [ ] Compare current price to rolling average (optional: 1hr, 24hr, 7-day averages)
- [ ] Create alert trigger logic:
  - Absolute price drop (e.g., $100+ lower)
  - Percentage drop (e.g., 40% lower than last hour)
  - Lowest price in X days
- [ ] Implement cooldown/debouncing (don't notify twice within 5 minutes for same team)
- [ ] Log all alerts to database

**Deliverables:**
- Alert detection engine
- Configurable alert thresholds configuration
- Alert history database table

---

### 4. **Notification System**
**Goal:** Send instant alerts to your phone via cheap/free channels

**Options (ranked by cost/ease):**
1. **Email** (cheapest - free with Gmail SMTP)
   - Setup Gmail app password
   - Use Nodemailer library
   
2. **SMS via Twilio** ($0.0075 per SMS - ~$5/month for active monitoring)
   - Create Twilio account with trial credits
   
3. **Push Notifications** (free but requires app setup)
   - OneSignal (free tier available)
   - Firebase Cloud Messaging
   
4. **Webhook to Discord/Slack** (free)
   - Send messages to private Discord server
   - Easy to integrate, already have phone notifications

**Recommended:** Email + Discord (free combo)

**Tasks:**
- [ ] Set up email service (Gmail SMTP)
- [ ] Set up Discord webhook (optional)
- [ ] Create notification formatter with key info:
  - Team name
  - Price level (100/300)
  - Old price vs new price
  - Percentage drop
  - Timestamp
  - Direct link to purchase (if available)
- [ ] Implement notification routing logic
- [ ] Add notification preferences (which channels, which alert types)
- [ ] Create notification history/logs

**Deliverables:**
- Notification service module
- Configuration for email/Discord credentials
- Notification template formatter

---

### 5. **Scheduler & Automation**
**Goal:** Keep the system running continuously with reliable scheduling

**Tasks:**
- [ ] Choose scheduler (node-cron, node-schedule, pm2)
- [ ] Configure scraping intervals (variable timing to avoid detection)
- [ ] Add logging for all scheduled tasks
- [ ] Implement health checks
- [ ] Create process manager config (PM2)
- [ ] Add graceful shutdown handling
- [ ] Monitor for crashes and restart automatically

**Deliverables:**
- Scheduler configuration file
- PM2 ecosystem config (pm2.config.js)
- Health check logging

---

### 6. **Configuration & Settings**
**Goal:** Centralize all configurable parameters

**Config file should include:**
```
- Scraping interval (minutes)
- Alert thresholds (percentage drop, absolute drop, etc.)
- Price averaging windows (1hr, 24hr, 7-day)
- Notification channels (email, Discord, SMS)
- Email credentials
- Discord webhook URL
- Database connection settings
- Alert cooldown period
- Log retention settings
```

**Deliverables:**
- `.env` file template with example values
- `config.js` that reads from `.env`
- Configuration validation on startup

---

### 7. **Data Analysis & Reporting** (Phase 2)
**Goal:** Use historical data for statistical insights

**Tasks:**
- [ ] Create price trend analysis queries
- [ ] Build dashboard/reports for:
  - Price history charts per team
  - Volatility analysis (which teams fluctuate most)
  - Best deal alerts (lowest price seen)
  - Seasonal trends
- [ ] Export data for external analysis (CSV, JSON)

**Deliverables:**
- Analytics query functions
- Report generation script
- Dashboard (optional: web UI)

---

### 8. **Logging & Monitoring**
**Goal:** Track system health and have audit trail

**Tasks:**
- [ ] Implement structured logging (Winston or Pino)
- [ ] Log levels: error, warn, info, debug
- [ ] Create separate log files for:
  - Scraping operations
  - Database operations
  - Alerts triggered
  - Errors/warnings
- [ ] Log rotation (archive old logs)
- [ ] Create monitoring dashboard (optional)

**Deliverables:**
- Logging configuration
- Log file structure
- Log analysis scripts

---

## File Structure (Recommended)

\`\`\`
cfp-rsvp-scraper/
├── scripts/
│   ├── getRSVPPrice.js          # Web scraper
│   ├── scheduler.js              # Scheduling engine
│   ├── priceChecker.js           # Alert detection
│   └── notifier.js               # Notification service
├── database/
│   ├── db.js                     # Database connection
│   ├── schema.sql                # Database schema
│   └── queries.js                # Database queries
├── config/
│   ├── .env.example              # Environment template
│   ├── config.js                 # Config loader
│   └── alerts.config.js          # Alert thresholds
├── logs/
│   ├── scraping.log
│   ├── alerts.log
│   └── errors.log
├── utils/
│   ├── logger.js                 # Logging setup
│   ├── validators.js             # Data validation
│   └── formatters.js             # Data formatting
├── cfp-rsvp-html/
│   ├── teampage*.html            # Team pages
│   └── accountpage.html
├── pm2.config.js                 # PM2 configuration
├── package.json
└── README.md
\`\`\`

---

## Implementation Phases

### **Phase 1: MVP (Weeks 1-2)**
- [x] Web scraper (you have this)
- [x] Basic database (SQLite)
- [x] Price change detection (simple percentage-based)
- [x] Email notifications (Gmail)
- [x] Basic scheduler
- [x] Configuration system

### **Phase 2: Enhancement (Weeks 3-4)**
- [ ] Add Discord notifications
- [ ] Implement rolling averages
- [ ] Add alert cooldown/debouncing
- [ ] Improve logging
- [ ] Add health checks

### **Phase 3: Analysis (Weeks 5+)**
- [ ] Dashboard/reporting
- [ ] Statistical analysis
- [ ] Price trend predictions
- [ ] Mobile app push notifications (optional)

---

## Technology Stack (Recommended)

| Component | Technology | Reason |
|-----------|-----------|--------|
| Scraping | Node.js + fs | Already using |
| Database | SQLite (Phase 1) / PostgreSQL (future) | Lightweight, no setup |
| Scheduling | node-cron | Simple, built-in |
| Notifications | Nodemailer + Discord API | Free, reliable |
| Logging | Winston | Structured, rotatable |
| Process Manager | PM2 | Keeps service running |
| Config | dotenv | Standard practice |

---

## Cost Analysis

| Component | Monthly Cost |
|-----------|------------|
| Email notifications | Free (Gmail) |
| Discord notifications | Free |
| Database (SQLite) | Free |
| Hosting (if self-hosted) | $0-5 (VPS) |
| SMS (optional) | $5-10 (Twilio) |
| **Total** | **Free-$15/month** |

---

## Success Metrics

- [ ] Scraper runs reliably every N minutes
- [ ] Zero missed price drops >30%
- [ ] Notifications arrive <1 minute after price drops
- [ ] Database grows consistently with price history
- [ ] System uptime >99%
- [ ] No false alerts due to data errors