const pool = require('./pool');

async function getAllRiders() {
    const { rows } = await pool.query(
        `SELECT r.rider_id, r.name, c.name AS coaster_name
        FROM riders r
        LEFT JOIN riders_coasters rc ON rc.rider_id = r.rider_id
        LEFT JOIN coasters c ON c.coaster_id = rc.coaster_id`
    );

    const ridersMap = {};

    rows.forEach(row => {
        if (!ridersMap[row.rider_id]) {
            ridersMap[row.rider_id] = {
                rider_id: row.rider_id,
                name: row.name,
                coasters: [],
            };
        };

        if (row.coaster_name) {
            ridersMap[row.rider_id].coasters.push(row.coaster_name);
        };
    });

    return Object.values(ridersMap);
};

async function postNewRider(name) {
    await pool.query(
        `INSERT INTO riders (name) 
        VALUES ($1)`, [name]
    );
};

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

async function updateExistingRider(name, id) {
    await pool.query(
        `UPDATE riders SET name = $1 WHERE rider_id = $2`, [name, id]
    );
};

async function deleteRiderById(id) {
    await pool.query(
        `DELETE FROM riders WHERE rider_id = $1`, [id]
    );
};

async function getRiderIdFromName(name) {
    const { rows } = await pool.query(
        `SELECT rider_id FROM riders WHERE name = $1`, [name]
    );

    if (rows.length === 0) {
        return null;
    };

    return rows[0].rider_id;
};

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
    findRiderById,
    updateExistingRider,
    getRiderIdFromName,
    deleteRiderById,
    addCoasterToRiderById,
};