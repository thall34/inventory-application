const db = require('../db/coasterQueries');
const { getRiderIdFromName, addCoasterToRiderById } = require('../db/riderQueries');
const { validationResult, matchedData } = require('express-validator');

// Retrieves all coasters from database and displays it on coasters main page
async function getAllCoasters(req, res, next) {
    try {
        const coasters = await db.getAllCoasters();
        res.render('allCoasters', {
            title: 'All Coasters',
            coasters: coasters,
        });

    } catch (err) {
        next(err);
    };
};

// Retrieves the add new coaster form
async function getNewCoasterForm(req, res, next) {
    try {
        res.render('newCoasterForm', {
            title: 'Add New Coaster',
        });

    } catch (err) {
        next(err);
    };
};

// Adds a new coaster to the database, adds a new park to the parks table if the park name field doesn't find a matching name
async function postNewCoaster(req, res, next) {
    try {
        // Gets results from coaster form validation in middleware/validateCoaster.js
        const errors = validationResult(req);

        // If there are any errors, redisplay the form page with errors at the top
        if (!errors.isEmpty()) {
            return res.status(400).render('newCoasterForm', {
                title: 'Add New Coaster',
                errors: errors.array()
            });
        };

        // Receive sanitized and verified information and use it to create new coaster entry in database
        const { coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, parkName } = matchedData(req);
        await db.postNewCoaster(coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, parkName);
        // Returns to main coaster page after submitting
        res.redirect('/coaster');

    } catch (err) {
        next(err);
    };
};

// Retrieves the update coaster form for the appropriate coaster based on an ID passed through in req.params
async function getUpdateCoasterForm(req, res, next) {
    try {
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;

        // Finds matching coaster in the database by ID
        const coaster = await db.findCoasterById(id);

        // If ID doesn't match any coasters, redirects to the error page
        if (!coaster) {
            return res.status(401).render('errors', {
                title: 'Error 401 - Coaster not found',
                message: 'Error 401 - Coaster not found in database',
            });
        };

        // Once coaster has been found, renders the update form with the coaster details
        res.render('updateCoasterForm', {
            title: 'Update Coaster',
            coaster: coaster,
        });

    } catch (err) {
        next(err);
    };
};

// Adds updated coaster data to the database based on the id from the previous form retrieval, 
// adds a new park to the parks table if the park name field doesn't find a matching name
async function postUpdatedCoaster(req, res, next) {
    try {
        // Gets results from coaster form validation in middleware/validateCoaster.js
        const errors = validationResult(req);
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;

        // If there are any errors, redisplay the form page with errors at the top
        if (!errors.isEmpty()) {
            // Finds matching coaster in the database by ID
            const coaster = await db.findCoasterById(id);

            // If ID doesn't match any coasters, redirects to the error page
            if (!coaster) {
                return res.status(401).render('errors', {
                    title: 'Error 401 - Coaster not found',
                    message: 'Error 401 - Coaster not found in database',
                });
            };

            // If errors were found in middleware/validateCoaster.js, it will redisplay the page with the errors at the top
            return res.status(400).render('updateCoasterForm', {
                title: 'Update Coaster',
                coaster: coaster,
                errors: errors.array(),
            });
        };

        // Receive sanitized and verified information and use it to update coaster entry in database
        const { coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, parkName } = matchedData(req);
        await db.updateExistingCoaster(coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, id, parkName);
        // Returns to main coaster page after submitting
        res.redirect('/coaster');

    } catch (err) {
        next(err);
    };
};

// Retrieves a coaster data page for the appropriate coaster based on an ID passed through in req.params
async function getSingleCoaster(req, res, next) {
    try {
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;

        // Finds matching coaster in the database by ID
        const coaster = await db.findCoasterById(id);

        // If ID doesn't match any coasters, redirects to the error page
        if (!coaster) {
            return res.status(401).render('errors', {
                title: 'Error 401 - Coaster not found',
                message: 'Error 401 - Coaster not found in database',
            });
        };

        // Renders coaster data page with the selected coaster ID
        res.render('coasterData', {
            title: 'Coaster Data',
            coaster: coaster,
        });

    } catch (err) {
        next(err);
    };
};

// Deletes the appropriate coaster from database based on an ID passed through in req.params
async function deleteSingleCoaster(req, res, next) {
    try {
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;

        // Deletes matching coaster in the database by ID
        await db.deleteCoasterById(id);
        // Returns to main coaster page after deleting
        res.redirect('/coaster');

    } catch (err) {
        next(err);
    };
};

// Retrieves the add rider from specified coaster form using an ID passed through in req.params
async function getAddToRiderForm(req, res, next) {
    try {
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;

        // Finds matching coaster in the database by ID
        const coaster = await db.findCoasterById(id);

        // If ID doesn't match any coasters, redirects to the error page
        if (!coaster) {
            return res.status(401).render('errors', {
                title: 'Error 401 - Coaster not found',
                message: 'Error 401 - Coaster not found in database',
            });
        };

        // Renders add rider from coaster form
        res.render('addRiderFromCoasterForm', {
            title: 'Add Coaster to Rider',
            coaster: coaster,
        });

    } catch (err) {
        next(err);
    };
};

// Adds connection in rider/coaster join table through the appropriate coaster ID passed through in req.params 
// and the rider ID passed through in the add rider from coaster form's req.body
async function postCoasterToRider(req, res, next) {
    try {
        // Receives validated ID from middleware/validateId.js
        const coasterId = req.validatedId;

        // Receives riderName from the post method of the add rider from coaster form
        const { riderName } = req.body;
        // Finds matching rider in the database by ID
        const riderId = await getRiderIdFromName(riderName);

        // If riderId doesn't match any riders, redirects to the error page
        if (!riderId) {
            return res.status(403).render('errors', {
                title: 'Error 403 - Rider not found',
                message: 'Error 403 - Rider not found in database',
            });
        };

        // Adds link through riders_coasters join table to connect the coaster ID with the rider ID
        await addCoasterToRiderById(coasterId, riderId);
        // Redirects back to the coaster that the add rider from coaster form was initialized from
        res.redirect(`/coaster/${coasterId}`);

    } catch (err) {
        next(err);
    };
};

module.exports = {
    getAllCoasters,
    getNewCoasterForm,
    postNewCoaster,
    getSingleCoaster,
    deleteSingleCoaster,
    getUpdateCoasterForm,
    postUpdatedCoaster,
    getAddToRiderForm,
    postCoasterToRider,
};