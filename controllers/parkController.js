const { validationResult, matchedData } = require('express-validator');
const db = require('../db/parkQueries');

// Retrieves all parks from database and displays it on parks main page
async function getAllParks(req, res, next) {
    try {
        const parks = await db.getAllParks();
        res.render('allParks', {
            title: 'All Parks',
            parks: parks,
        });

    } catch (err) {
        next(err);
    };
};

// Retrieves the add new park form
async function getNewParkForm(req, res, next) {
    try {
        res.render('newParkForm', {
            title: 'Add New Park',
        });

    } catch (err) {
        next(err);
    };
};

// Adds a new park to the database
async function postNewPark(req, res, next) {
    try {
        // Gets results from park form validation in middleware/validatePark.js
        const errors = validationResult(req);

        // If there are any errors, redisplay the form page with errors at the top
        if (!errors.isEmpty()) {
            return res.status(400).render('newParkForm', {
                title: 'Add New Coaster',
                errors: errors.array(),
            });
        };

        // Receive sanitized and verified information and use it to create new park entry in database
        const { parkName } = matchedData(req);
        await db.postNewPark(parkName);
        // Returns to main park page after submitting
        res.redirect('/park');

    } catch (err) {
        next(err);
    };
};

// Retrieves the update park form for the appropriate park based on an ID passed through in req.params
async function getUpdateParkForm(req, res, next) {
    try {
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;

        // Finds matching park in the database by ID
        const park = await db.findParkById(id);

        // If ID doesn't match any parks, redirects to the error page
        if (!park) {
            return res.status(402).render('errors', {
                title: 'Error 402 - Park not found',
                message: 'Error 402 - Park not found in database',
            });
        };

        // Once park has been found, renders the update form with the park details
        res.render('updateParkForm', {
            title: 'Update Park',
            park: park,
        });

    } catch (err) {
        next(err);
    };
};

// Adds updated park data to the database based on the id from the previous form retrieval
async function postUpdatedPark(req, res, next) {
    try {
        // Gets results from park form validation in middleware/validatePark.js
        const errors = validationResult(req);
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;

        // If there are any errors, redisplay the form page with errors at the top
        if (!errors.isEmpty()) {
            // Finds matching park in the database by ID
            const park = await db.findParkById(id);

            // If ID doesn't match any parks, redirects to the error page
            if (!park) {
                return res.status(402).render('errors', {
                    title: 'Error 402 - Park not found',
                    message: 'Error 402 - Park not found in database',
                });
            };

            // If errors were found in middleware/validatePark.js, it will redisplay the page with the errors at the top
            return res.status(400).render('updateParkForm', {
                title: 'Update Park',
                park: park,
                errors: errors.array(),
            });
        };

        // Receive sanitized and verified information and use it to update park entry in database
        const { parkName } = matchedData(req);
        await db.updateExistingPark(parkName, id);
        // Returns to main park page after submitting
        res.redirect('/park');

    } catch (err) {
        next(err);
    };
};

// Retrieves a park data page for the appropriate park based on an ID passed through in req.params
async function getSinglePark(req, res, next) {
    try {
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;

        // Finds matching park in the database by ID
        const park = await db.findParkById(id);

        // If ID doesn't match any parks, redirects to the error page
        if (!park) {
            return res.status(402).render('errors', {
                title: 'Error 402 - Park not found',
                message: 'Error 402 - Park not found in database',
            });
        };

        // Renders park data page with the selected park ID
        res.render('parkData', {
            title: 'Park Data',
            park: park,
        });

    } catch (err) {
        next(err);
    };
};

// Deletes the appropriate park from database based on an ID passed through in req.params
async function deleteSinglePark(req, res, next) {
    try {
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;

        // Deletes matching park in the database by ID
        await db.deleteParkById(id);
        // Returns to the main park page after deleting
        res.redirect('/park');

    } catch (err) {
        next(err);
    };
};

module.exports = {
    getAllParks,
    getNewParkForm,
    postNewPark,
    getUpdateParkForm,
    postUpdatedPark,
    getSinglePark,
    deleteSinglePark,
};