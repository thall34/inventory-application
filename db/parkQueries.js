const pool = require('./pool');

// Selects all parks from the parks table and the list of coasters associated with the park, and returns them ordered by park name
async function getAllParks() {
    const { rows } = await pool.query(
        `SELECT parks.park_id, parks.name, coasters.name AS coaster_name 
        FROM parks
        LEFT JOIN coasters
        ON coasters.park_id = parks.park_id
        ORDER BY parks.name`
    );

    // The join will have multiple entries for the same park as it creates one entry per coaster
    // The following function groups the park's coasters into an array for easier displaying later
    const parks = [];
    const parksMap = {};

    rows.forEach(row => {
        if (!parksMap[row.park_id]) {
            parksMap[row.park_id] = {
                park_id: row.park_id,
                name: row.name,
                coasters: [],
            };

            parks.push(parksMap[row.park_id]);
        };

        if (row.coaster_name) {
            parksMap[row.park_id].coasters.push(row.coaster_name);
        };
    });

    return parks;
};

// Adds new park entry into the parks table
async function postNewPark(name) {
    await pool.query(
        `INSERT INTO parks (name) 
        VALUES ($1)`, [name]
    );
};

// Searches parks table and returns either the first park that matches the search name or returns null if no parks contain the search name
async function getParkIdFromName(name) {
    const { rows } = await pool.query(
        `SELECT park_id FROM parks WHERE name = $1`, [name]
    );

    if (rows.length === 0) {
        return null
    };
    
    return rows[0].park_id;
};

// Searches parks table and returns either the first park that matches the search id or returns null if no parks contain the search id
async function findParkById(id) {
    const { rows } = await pool.query(
        `SELECT parks.park_id, parks.name, coasters.name AS coaster_name 
        FROM parks
        LEFT JOIN coasters
        ON coasters.park_id = parks.park_id
        WHERE parks.park_id = $1`, [id]
    );

    if (rows.length === 0) {
        return null;
    };

    // The join will have multiple entries for the park as it creates one entry per coaster
    // The following function groups the park's coasters into an array for easier displaying later
    const park = {
        park_id: rows[0].park_id,
        name: rows[0].name,
        coasters: [],
    };

    rows.forEach(row => {
        if (row.coaster_name) {
            park.coasters.push(row.coaster_name);
        };
    });

    return park;
};

// Updates park data for existing park in parks table using the id parameter
async function updateExistingPark(name, id) {
    await pool.query(
        `UPDATE parks SET name = $1 WHERE park_id = $2`, [name, id]
    );
};

// Deletes the park in the parks table that has a matching id
async function deleteParkById(id) {
    await pool.query(
        `DELETE FROM parks WHERE park_id = $1`, [id]
    );
};

module.exports = {
    getAllParks,
    postNewPark,
    getParkIdFromName,
    findParkById,
    updateExistingPark,
    deleteParkById,
};