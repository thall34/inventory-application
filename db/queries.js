const pool = require('./pool');

async function getAllCoasters() {
    const { rows } = await pool.query('SELECT * FROM coasters');

    if (!rows) {
        return 'No coasters logged yet';
    };

    return rows;
};

async function getAllParks() {
    const { rows } = await pool.query('SELECT * FROM parks');

    if (!rows) {
        return 'No parks logged yet';
    };

    return rows;
};

async function getAllRiders() {
    const { rows } = await pool.query('SELECT * FROM riders');

    if (!rows) {
        return 'No riders logged yet';
    };

    return rows;
};