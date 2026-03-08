// File that houses all Express endpoints for the server. 
// This keeps the main index.ts cleaner and more focused 
// on server setup.
import { getAllPricesQuery, getSingleTeamPricesQuery } from './db/queries';
import { getDatabase } from './db/db_init_script';

export const initializeEndpoints = (app: import('express').Express) => {
    // Endpoint: GET /api/prices - fetch all price data for all teams
    app.get('/api/prices', (req, res) => {
        try {
            const db = getDatabase();
            const prices = db.prepare(getAllPricesQuery).all();
            res.json({
                success: true,
                data: prices,
                count: prices.length,
            });
        } catch (error) {
            console.error('Error fetching prices:', error);
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    });

    // Endpoint: GET /api/prices/:teamId - fetch all price data for a specific team
    app.get('/api/prices/:teamId', (req, res) => {
        let teamId: string = req.params.teamId || 'No teamId provided';
        try {
            teamId = String(parseInt(req.params.teamId, 10));

            if (teamId === 'No teamId provided') {
                return res.status(400).json({ success: false, error: 'teamId parameter is required and must be a valid integer' });
            }
            
            const db = getDatabase();
            const prices = db.prepare(getSingleTeamPricesQuery).all(teamId);
            // or with named parameters:
            // const prices = db.prepare(getSingleTeamPricesQuery).all({ teamId });

            res.json({
                success: true,
                data: prices,
                count: prices.length,
            });
        } catch (error) {
            console.error('Error fetching prices for team ' + teamId + ': ', error);
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    });

    // Endpoint: GET /health - Health check endpoint
    app.get('/health', (req, res) => {
        res.json({ status: 'ok' });
    });
}