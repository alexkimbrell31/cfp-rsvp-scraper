# CFP RSVP Server

Backend server for the CFP RSVP Price Tracker. Built with Node.js, TypeScript, Express, and SQLite.

## Setup

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and update as needed:

```bash
cp .env.example .env
```

### Running the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm run start
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### Health Check
```bash
GET /health
```

### Get All Prices
```bash
GET /api/prices
```

Returns all current prices for active teams.

## Database

The server uses SQLite with the following schema:

### Tables

**teams**
```sql
CREATE TABLE teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**prices**
```sql
CREATE TABLE prices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL REFERENCES teams(id),
  level TEXT NOT NULL CHECK(level IN ('100', '300')),
  price REAL NOT NULL,
  timestamp TEXT NOT NULL,
  FOREIGN KEY(team_id) REFERENCES teams(id)
);
```

The database file is stored at `src/cfp-rsvp.db` and uses Write-Ahead Logging (WAL) for better concurrency.

## Database Examples

### Insert a new team
```sql
INSERT INTO teams (name, active) VALUES ('Alabama', 1);
INSERT INTO teams (name, active) VALUES ('Ohio State', 1);
INSERT INTO teams (name, active) VALUES ('Georgia', 1);
```

### Insert price data (a scrape snapshot)
```sql
-- Insert 100 Level prices for Alabama (ranks 1-6, cheapest to least cheap)
INSERT INTO prices (team_id, level, rank, price, timestamp) 
VALUES (1, '100', 1, 5000.00, datetime('now'));

INSERT INTO prices (team_id, level, rank, price, timestamp) 
VALUES (1, '100', 2, 5500.00, datetime('now'));

INSERT INTO prices (team_id, level, rank, price, timestamp) 
VALUES (1, '100', 3, 6000.00, datetime('now'));

-- Insert 300 Level prices for Alabama
INSERT INTO prices (team_id, level, rank, price, timestamp) 
VALUES (1, '300', 1, 3000.00, datetime('now'));

INSERT INTO prices (team_id, level, rank, price, timestamp) 
VALUES (1, '300', 2, 3500.00, datetime('now'));
```

### Update an existing team (toggle active status)
```sql
UPDATE teams SET active = 0 WHERE name = 'Alabama';
UPDATE teams SET active = 1 WHERE id = 1;
```

### Delete a specific price record
```sql
DELETE FROM prices WHERE id = 5;
```

### Delete all prices for a team
```sql
DELETE FROM prices WHERE team_id = 1;
```

### View all teams
```sql
SELECT * FROM teams;
```

### View all prices for Alabama
```sql
SELECT * FROM prices WHERE team_id = 1;
```

### View the latest price snapshot (most recent timestamp) for all teams
```sql
SELECT t.name, p.level, p.price, p.timestamp
FROM prices p
JOIN teams t ON p.team_id = t.id
WHERE p.timestamp = (SELECT MAX(timestamp) FROM prices)
ORDER BY t.name, p.level;
```

## Viewing the Database

To view and manage the SQLite database in VS Code, install a SQLite extension like:
- **SQLite** by `alexcvzz`
- **SQLite Viewer** by `Florian Didier`

Then right-click the `cfp-rsvp.db` file and select "Open with SQLite" or similar.

## Architecture

- `src/index.ts` – Express server and API routes
- `src/db/db_init_script.ts` – Database initialization and connection
- `tsconfig.json` – TypeScript configuration
- `cfp-rsvp.db` – SQLite database file (created on first run)

## Next Steps

- Add GraphQL endpoint for web & mobile clients
- Integrate scraper to populate prices
- Add authentication/API token validation
- Add more endpoints (POST /teams, PATCH /teams/:id, etc.)
