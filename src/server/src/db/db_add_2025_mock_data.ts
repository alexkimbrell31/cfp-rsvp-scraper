import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../cfp-rsvp.db');

interface PriceSnapshot {
  date: string;
  timestamp: string;
  prices: Record<string, number>;
}

const TEAMS = [
  'Ohio State',
  'Indiana',
  'Alabama',
  'Oregon',
  'Vanderbilt',
  'Miami',
  'Ole Miss',
  'Georgia',
  'Georgia Tech',
  'Oklahoma',
  'Texas A&M',
  'LSU',
  'Tennessee',
  'Texas',
  'Michigan',
  'Missouri',
  'Notre Dame',
];

// Price snapshots from the 2025 campaign
const PRICE_SNAPSHOTS: PriceSnapshot[] = [
  {
    date: '2025-10-04',
    timestamp: '2025-10-04T10:00:00Z',
    prices: {
      'Ohio State': 375,
      'Miami': 300,
      'Oregon': 200,
      'Georgia': 240,
      'Texas A&M': 75,
      'Oklahoma': 50,
      'LSU': 200,
      'Ole Miss': 52,
      'Alabama': 160,
      'Notre Dame': 250,
      'Indiana': 25,
      'Tennessee': 50,
      'Missouri': 10,
    },
  },
  {
    date: '2025-10-20',
    timestamp: '2025-10-20T10:00:00Z',
    prices: {
      'Ohio State': 375,
      'Miami': 120,
      'Oregon': 189,
      'Georgia': 232.8,
      'Texas A&M': 120,
      'Oklahoma': 36,
      'LSU': 72,
      'Ole Miss': 60,
      'Alabama': 190,
      'Notre Dame': 236,
      'Indiana': 125,
      'Tennessee': 36,
      'Texas': 150,
      'Michigan': 60,
      'Missouri': 12,
    },
  },
  {
    date: '2025-11-07',
    timestamp: '2025-11-07T10:00:00Z',
    prices: {
      'Ohio State': 425,
      'Texas A&M': 360,
      'Georgia': 231.6,
      'Notre Dame': 236.4,
      'Texas': 156,
      'Oregon': 138,
      'Alabama': 190,
      'Indiana': 150,
    },
  },
  {
    date: '2025-11-23',
    timestamp: '2025-11-23T10:00:00Z',
    prices: {
      'Ohio State': 425,
      'Texas A&M': 570,
      'Georgia': 240,
      'Notre Dame': 250,
      'Oregon': 160,
      'Alabama': 130,
      'Indiana': 269,
    },
  },
  {
    date: '2025-12-02',
    timestamp: '2025-12-02T10:00:00Z',
    prices: {
      'Ohio State': 600,
      'Alabama': 282,
      'Oregon': 198,
      'Indiana': 360,
      'Texas A&M': 516,
      'Notre Dame': 350,
    },
  },
  {
    date: '2025-12-07',
    timestamp: '2025-12-07T10:00:00Z',
    prices: {
      'Ohio State': 600,
      'Alabama': 282,
      'Oregon': 198,
      'Indiana': 450,
      'Texas A&M': 450,
    },
  },
  {
    date: '2026-01-05',
    timestamp: '2026-01-05T10:00:00Z',
    prices: {
      'Indiana': 3180,
      'Miami': 2340,
      'Ole Miss': 960,
      'Oregon': 498,
    },
  },
];

export function addMockData() {
  const db = new Database(dbPath);

  console.log('🔄 Starting mock data insertion...\n');

  // Insert teams
  console.log('📝 Inserting teams...');
  const insertTeam = db.prepare(`
    INSERT OR IGNORE INTO teams (name, active) VALUES (?, 1)
  `);

  TEAMS.forEach((team) => {
    insertTeam.run(team);
  });
  console.log(`✅ Inserted ${TEAMS.length} teams\n`);

  // Insert price snapshots
  console.log('📊 Inserting price snapshots...');
  const insertPrice = db.prepare(`
    INSERT INTO prices (team_id, level, price, timestamp)
    SELECT (SELECT id FROM teams WHERE name = ?), ?, ?, ?
  `);

  let totalPricesInserted = 0;

  PRICE_SNAPSHOTS.forEach((snapshot) => {
    console.log(`  📅 ${snapshot.date}`);

    Object.entries(snapshot.prices).forEach(([teamName, price]) => {
      // Insert for both 100 and 300 level
      // Assuming roughly 60% of the option price gets split between the two levels
      const price100 = price;
      const price300 = Math.round(price * 0.6);

      insertPrice.run(teamName, '100', price100, snapshot.timestamp);

      totalPricesInserted += 1;
    });
  });

  console.log(`✅ Inserted ${totalPricesInserted} price records\n`);

  // Display summary
  const teamCount = db.prepare('SELECT COUNT(*) as count FROM teams').get() as { count: number };
  const priceCount = db.prepare('SELECT COUNT(*) as count FROM prices').get() as { count: number };

  console.log('📈 Database Summary:');
  console.log(`   Teams: ${teamCount.count}`);
  console.log(`   Price Records: ${priceCount.count}`);
  console.log('   Price Snapshots: ' + PRICE_SNAPSHOTS.length);
  console.log('\n✨ Mock data insertion complete!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addMockData();
}
