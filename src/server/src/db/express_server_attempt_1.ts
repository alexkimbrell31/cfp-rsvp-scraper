import express from 'express';
import { initializeDatabase, getDatabase } from './db_init_script';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize DB on startup
initializeDatabase();

// Endpoint: GET /api/prices - fetch all price data
app.get('/api/prices', (req, res) => {
  try {
    const db = getDatabase();
    
    const query = `
      SELECT 
        t.id,
        t.name,
        p.level,
        p.price,
        p.timestamp
      FROM prices p
      JOIN teams t ON p.team_id = t.id
      WHERE t.active = 1
      ORDER BY t.name, p.timestamp DESC
    `;
    
    const prices = db.prepare(query).all();
    
    res.json({
      success: true,
      data: prices,
      count: prices.length,
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});