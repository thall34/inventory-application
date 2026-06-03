const pool = require('./pool');

// Selects all coasters from the coasters table and the park associated with each coaster, and returns them ordered by coaster name
// If multiple coasters have the same name, orders those by park name associated with said coasters
async function getAllCoasters() {
    const { rows } = await pool.query(
        `SELECT coasters.coaster_id, coasters.name, parks.name AS park_name
        FROM coasters
        JOIN parks
        ON coasters.park_id = parks.park_id
        ORDER BY coasters.name, park_name`
    );
    return rows;
};

// Helper function that checks if the park exists in the parks table or not
// If it does not exist, it creates a new entry and returns the park_id for new coaster entry creation
async function getOrCreateParkId(parkName) {
    const { rows } = await pool.query(
        `INSERT INTO parks (name)
        VALUES ($1)
        ON CONFLICT (name)
        DO UPDATE SET name = EXCLUDED.name
        RETURNING park_id`,
        [parkName]
    );

    return rows[0].park_id;
};

// Adds new coaster entry into the coasters table
// Uses the helper function getOrCreateParkId (see above)
async function postNewCoaster(name, inversions, speed, height, length, parkName) {
    const parkId = await getOrCreateParkId(parkName);

    await pool.query(
        `INSERT INTO coasters (name, park_id, inversions, speed, height, length)
        VALUES ($1, $2, $3, $4, $5, $6)`, [name, parkId, inversions, speed, height, length]
    );
};

// Searches coasters table and returns either the first coaster that matches the search name or returns null if no coasters contain the search name
async function getCoasterIdFromName(name) {
    const { rows } = await pool.query(
        `SELECT coaster_id FROM coasters WHERE name = $1`, [name]
    );

    if (rows.length === 0) {
        return null
    } else {
        return rows[0].coaster_id;
    };
};

// Searches the coaster table and returns either the first coaster that matches the search id or returns null if no coasters contain the search id
async function findCoasterById(id) {
    const { rows } = await pool.query(
        `SELECT coasters.coaster_id, coasters.name, coasters.inversions, coasters.speed, coasters.height, coasters.length, parks.name AS park_name
        FROM coasters
        JOIN parks
        ON coasters.park_id = parks.park_id
        WHERE coasters.coaster_id = $1`, [id]
    );

    if(rows.length === 0) {
        return null;
    };

    return rows[0];
};

// Updates coaster data for existing coaster in coasters table using the id parameter
// Uses the helper function getOrCreateParkId (see above)
async function updateExistingCoaster(name, inversions, speed, height, length, id, parkName) {
    const parkId = await getOrCreateParkId(parkName);

    await pool.query(
            `UPDATE coasters SET name = $1, park_id = $2, inversions = $3, speed = $4, height = $5, length = $6
            WHERE coaster_id = $7`,
            [name, parkId, inversions, speed, height, length, id]
        );
};

// Deletes the coaster in the coasters table that has a matching id
async function deleteCoasterById(id) {
    await pool.query(
        `DELETE FROM coasters WHERE coaster_id = $1`, [id]
    );
};

module.exports = {
    getAllCoasters,
    postNewCoaster,
    getCoasterIdFromName,
    findCoasterById,
    updateExistingCoaster,
    deleteCoasterById,
};