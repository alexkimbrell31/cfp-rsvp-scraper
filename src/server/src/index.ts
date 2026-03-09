import express from 'express';
import { initializeDatabase } from './db/db_init_script';
import { initializeEndpoints } from './endpoints';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize DB on startup
initializeDatabase();

// Middleware
app.use(express.json());

// app.use(cors({
//   origin: 'http://localhost:5173'
// }))

// Create an initial setup function where app can be
// passed to all endpoints that need to be defined prior to 
// server startup. (basically all endpoints).
initializeEndpoints(app);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});