const pool = require('./pool');

async function getAllParks() {
    const { rows } = await pool.query(
        `SELECT parks.park_id, parks.name, coasters.name AS coaster_name 
        FROM parks
        LEFT JOIN coasters
        ON coasters.park_id = parks.park_id`);

        const parksMap = {};

        rows.forEach(row => {
            if (!parksMap[row.park_id]) {
                parksMap[row.park_id] = {
                    park_id: row.park_id,
                    name: row.name,
                    coasters: [],
                };
            };

            if (row.coaster_name) {
                parksMap[row.park_id].coasters.push(row.coaster_name);
            };
        });

        return Object.values(parksMap);
};

async function postNewPark(name) {
    await pool.query(
        `INSERT INTO parks (name) 
        VALUES ($1)`, [name]
    );
};

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

async function getParkIdFromName(name) {
    const { rows } = await pool.query(
        `SELECT park_id FROM parks WHERE name = $1`, [name]
    );

    if (rows.length === 0) {
        return null
    };
    
    return rows[0].park_id;
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

module.exports = {
    getAllParks,
    postNewPark,
    findParkById,
    getParkIdFromName,
    updateExistingPark,
    deleteParkById,
};