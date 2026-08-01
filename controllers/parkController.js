const { validationResult, matchedData } = require('express-validator');
const db = require('../models/parkModels');
const success = require('../utils/success');
const failure = require('../utils/failure');

// Retrieves all parks from database and displays it on parks main page
async function getAllParks(req, res, next) {
    try {
        const parks = await db.getAllParks();
        return success(res, 200, 'allParks', 'All Parks', parks);
    } catch (err) {
        next(err);
    };
};

// Retrieves the add new park form
async function getNewParkForm(req, res, next) {
    try {
        return success(res, 200, 'newParkForm', 'Add New Park');
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
            return failure(res, 400, 'newParkForm', 'Add New Park', errors.array());
        };
        // Receive sanitized and verified information and use it to create new park entry in database
        const { parkName } = matchedData(req);
        await db.postNewPark(parkName);
        // Returns to main park page after submitting
        return success(res, 201, '/park');
    } catch (err) {
        if (err.code === '23505') {
            return failure(res, 409, 'errors', 'Error 409 - Park already exists')
        };

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
            return failure(res, 401, 'errors', 'Error 401 - Park not found')
        };
        // Once park has been found, renders the update form with the park details
        return success(res, 200, 'updateParkForm', `Update ${park.name}`, park);
    } catch (err) {
        next(err);
    };
};

// Adds updated park data to the database based on the id from the previous form retrieval
async function putUpdatedPark(req, res, next) {
    try {
        // Gets results from park form validation in middleware/validatePark.js
        const errors = validationResult(req);
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;
        // Finds matching park in the database by ID
        const park = await db.findParkById(id);
        // If ID doesn't match any parks, redirects to the error page
        if (!park) {
            return failure(res, 401, 'errors', 'Error 401 - Park not found')
        };
        // If there are any errors, redisplay the form page with errors at the top
        if (!errors.isEmpty()) {
            // If errors were found in middleware/validatePark.js, it will redisplay the page with the errors at the top
            return failure(res, 400, 'updateParkForm', `Update ${park.name}`, errors.array(), park);
        };

        // Receive sanitized and verified information and use it to update park entry in database
        const { parkName } = matchedData(req);
        await db.updateExistingPark(parkName, id);
        // Returns to main park page after submitting
        return success(res, 200, '/park');
    } catch (err) {
        if (err.code === '23505') {
            return failure(res, 409, 'errors', 'Error 409 - Park already exists')
        };

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
            return failure(res, 401, 'errors', 'Error 401 - Park not found');
        };
        // Renders park data page with the selected park ID
        return success(res, 200, 'parkData', park.name, park);
    } catch (err) {
        next(err);
    };
};

// Deletes the appropriate park from database based on an ID passed through in req.params
async function deleteSinglePark(req, res, next) {
    try {
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;
        // Finds matching park in the database by ID
        const park = await db.findParkById(id);
        // If ID doesn't match any parks, redirects to the error page
        if (!park) {
            return failure(res, 401, 'errors', 'Error 401 - Park not found')
        };
        // Deletes matching park in the database by ID
        await db.deleteParkById(id);
        // Returns to the main park page after deleting
        return success(res, 204, '/park');
    } catch (err) {
        next(err);
    };
};

module.exports = {
    getAllParks,
    getNewParkForm,
    postNewPark,
    getUpdateParkForm,
    putUpdatedPark,
    getSinglePark,
    deleteSinglePark,
};