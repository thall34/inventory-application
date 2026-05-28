const pool = require('./pool');

async function getAllCoasters() {
    const { rows } = await pool.query('SELECT * FROM coasters');
    return rows;
};

async function postNewCoaster(name, inversions, speed, height, length) {
    await pool.query(
        `INSERT INTO coasters (name, inversions, speed, height, length) 
        VALUES ($1, $2, $3, $4, $5)`, [name, inversions, speed, height, length]
    );
};

async function findCoasterById(id) {
    const { rows } = await pool.query(
        `SELECT * FROM coasters
        WHERE coaster_id = $1`, [id]
    );

    return rows[0];
};

async function updateExistingCoaster(name, inversions, speed, height, length, id) {
    await pool.query(
        `UPDATE coasters SET name = $1, inversions = $2, speed = $3, height = $4, length = $5 
        WHERE coaster_id = $6`, 
        [name, inversions, speed, height, length, id]
    );
};

async function deleteCoasterById(id) {
    await pool.query(
        `DELETE FROM coasters WHERE coaster_id = $1`, [id]
    );
};

async function getAllParks() {
    const { rows } = await pool.query('SELECT * FROM parks');
    return rows;
};

async function postNewPark(name) {
    await pool.query(
        `INSERT INTO parks (name) 
        VALUES ($1)`, [name]
    );
};

async function findParkById(id) {
    const { rows } = await pool.query(
        `SELECT * FROM parks
        WHERE park_id = $1`, [id]
    );

    return rows[0];
};

async function updateExistingPark(name, id) {
    await pool.query(
        `UPDATE parks SET name = $1 WHERE park_id = $2`, [name, id]
    );
};

async function deleteParkById(id) {
    await pool.query(
        `DELETE FROM parks WHERE park_id = $1`, [id]
    );
};

async function getAllRiders() {
    const { rows } = await pool.query('SELECT * FROM riders');
    return rows;
};

async function postNewRider(name) {
    await pool.query(
        `INSERT INTO riders (name) 
        VALUES ($1)`, [name]
    );
};

async function findRiderById(id) {
    const { rows } = await pool.query(
        `SELECT * FROM riders
        WHERE rider_id = $1`, [id]
    );

    return rows[0];
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

module.exports = {
    getAllCoasters,
    postNewCoaster,
    findCoasterById,
    updateExistingCoaster,
    deleteCoasterById,
    getAllParks,
    postNewPark,
    findParkById,
    updateExistingPark,
    deleteParkById,
    getAllRiders,
    postNewRider,
    findRiderById,
    updateExistingRider,
    deleteRiderById,
};