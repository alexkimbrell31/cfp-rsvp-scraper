// Gathering all price entries from all teams (ordered by team name and timestamp)
export const getAllPricesQuery = `
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

export const getSingleTeamPricesQuery = `
    SELECT 
    t.id,
    t.name,
    p.level,
    p.price,
    p.timestamp
    FROM prices p
    JOIN teams t ON p.team_id = t.id
    WHERE t.active = 1 AND t.id = ?
    ORDER BY p.timestamp DESC
`;