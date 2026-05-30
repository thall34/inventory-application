const pool = require('./pool');

async function getAllCoasters() {
    const { rows } = await pool.query(
        `SELECT coasters.coaster_id, coasters.name, coasters.inversions, coasters.speed, coasters.height, coasters.length, parks.name AS park_name
        FROM coasters
        JOIN parks
        ON coasters.park_id = parks.park_id`);
    return rows;
};

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

async function postNewCoaster(name, inversions, speed, height, length, parkName) {
    const parkId = await getOrCreateParkId(parkName);

    await pool.query(
        `INSERT INTO coasters (name, park_id, inversions, speed, height, length)
        VALUES ($1, $2, $3, $4, $5, $6)`, [name, parkId, inversions, speed, height, length]
    );
};

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

async function updateExistingCoaster(name, inversions, speed, height, length, id, parkName) {
    const parkId = await getOrCreateParkId(parkName);

    await pool.query(
            `UPDATE coasters SET name = $1, park_id = $2, inversions = $3, speed = $4, height = $5, length = $6
            WHERE coaster_id = $7`,
            [name, parkId, inversions, speed, height, length, id]
        );
};

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

async function deleteCoasterById(id) {
    await pool.query(
        `DELETE FROM coasters WHERE coaster_id = $1`, [id]
    );
};

module.exports = {
    getAllCoasters,
    postNewCoaster,
    findCoasterById,
    getCoasterIdFromName,
    updateExistingCoaster,
    deleteCoasterById,
};