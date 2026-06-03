const pool = require('./pool');

// Selects all riders from the riders table and the coasters associated with each rider, and returns them ordered by rider name
async function getAllRiders() {
    const { rows } = await pool.query(
        `SELECT r.rider_id, r.name, c.name AS coaster_name
        FROM riders r
        LEFT JOIN riders_coasters rc ON rc.rider_id = r.rider_id
        LEFT JOIN coasters c ON c.coaster_id = rc.coaster_id
        ORDER BY r.name`
    );

    // The join will have multiple entries for the same rider as it creates one entry per coaster
    // The following function groups the rider's coasters into an array for easier displaying later
    const riders = []
    const ridersMap = {};

    rows.forEach(row => {
        if (!ridersMap[row.rider_id]) {
            ridersMap[row.rider_id] = {
                rider_id: row.rider_id,
                name: row.name,
                coasters: [],
            };

            riders.push(ridersMap[row.rider_id]);
        };

        if (row.coaster_name) {
            ridersMap[row.rider_id].coasters.push(row.coaster_name);
        };
    });

    return riders;
};

// Adds new rider entry into the riders table
async function postNewRider(name) {
    await pool.query(
        `INSERT INTO riders (name) 
        VALUES ($1)`, [name]
    );
};

// Searches riders table and returns either the first rider that matches the search name or returns null if no riders contain the search name
async function getRiderIdFromName(name) {
    const { rows } = await pool.query(
        `SELECT rider_id FROM riders WHERE name = $1`, [name]
    );

    if (rows.length === 0) {
        return null;
    };

    return rows[0].rider_id;
};

// Searches riders table and returns either the first rider that matches the search id or returns null if no riders contain the search id
async function findRiderById(id) {
    const { rows } = await pool.query(
        `SELECT r.rider_id, r.name, c.name AS coaster_name
        FROM riders r
        LEFT JOIN riders_coasters rc ON rc.rider_id = r.rider_id
        LEFT JOIN coasters c ON c.coaster_id = rc.coaster_id
        WHERE r.rider_id = $1`, [id]
    );

    if (rows.length === 0) {
        return null;
    };

    // The join will have multiple entries for the same rider as it creates one entry per coaster
    // The following function groups the rider's coasters into an array for easier displaying later
    const rider = {
        rider_id: rows[0].rider_id,
        name: rows[0].name,
        coasters: [],
    };

    rows.forEach(row => {
        if (row.coaster_name) {
            rider.coasters.push(row.coaster_name);
        };
    });

    return rider;
};

// Updates rider data for existing rider in riders table using the id parameter
async function updateExistingRider(name, id) {
    await pool.query(
        `UPDATE riders SET name = $1 WHERE rider_id = $2`, [name, id]
    );
};

// Deletes the park in the parks table that has a matching id
async function deleteRiderById(id) {
    await pool.query(
        `DELETE FROM riders WHERE rider_id = $1`, [id]
    );
};

// Adds coasterId and riderId link in the riders_coasters table to say which rider(s) have been on which coaster(s)
// If the specified riderId has already been associated with the coasterId, it doesn't alter the table
async function addCoasterToRiderById(coasterId, riderId) {
    await pool.query(
        `INSERT INTO riders_coasters (rider_id, coaster_id) 
        VALUES ($1, $2) 
        ON CONFLICT (rider_id, coaster_id) DO NOTHING`, 
        [riderId, coasterId]
    );
};

module.exports = {
    getAllRiders,
    postNewRider,
    getRiderIdFromName,
    findRiderById,
    updateExistingRider,
    deleteRiderById,
    addCoasterToRiderById,
};