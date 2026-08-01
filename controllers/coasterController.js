const db = require('../models/coasterModels');
const { getRiderIdFromName, addCoasterToRiderById } = require('../models/riderModels');
const { validationResult, matchedData } = require('express-validator');
const success = require('../utils/success');
const failure = require('../utils/failure');

// Retrieves all coasters from database and displays it on coasters main page
async function getAllCoasters(req, res, next) {
    try {
        const coasters = await db.getAllCoasters();
        return success(res, 200, 'allCoasters', 'All Coasters', coasters);
    } catch (err) {
        next(err);
    };
};

// Retrieves the add new coaster form
async function getNewCoasterForm(req, res, next) {
    try {
        return success(res, 200, 'newCoasterForm', 'Add New Coaster')
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
            return failure(res, 400, 'newCoasterForm', 'Add New Coaster', errors.array())
        };
        // Receive sanitized and verified information and use it to create new coaster entry in database
        const { coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, parkName } = matchedData(req);
        const parkId = await db.getOrCreateParkId(parkName);
        await db.postNewCoaster(coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, parkName, parkId);
        // Returns to main coaster page after submitting
        return success(res, 201, '/coaster');
    } catch (err) {
        if (err.code === '23505') {
            return failure(res, 409, 'errors', 'Error 409 - Coaster already exists')
        };

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
            return failure(res, 401, 'errors', 'Error 401 - Coaster not found');
        };
        // Once coaster has been found, renders the update form with the coaster details
        return success(res, 200, 'updateCoasterForm', `Update ${coaster.name}`, coaster);

    } catch (err) {
        next(err);
    };
};

// Adds updated coaster data to the database based on the id from the previous form retrieval, 
// adds a new park to the parks table if the park name field doesn't find a matching name
async function putUpdatedCoaster(req, res, next) {
    try {
        // Gets results from coaster form validation in middleware/validateCoaster.js
        const errors = validationResult(req);
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;
        // Finds matching coaster in the database by ID
        const coaster = await db.findCoasterById(id);
        // If ID doesn't match any coasters, redirects to the error page
        if (!coaster) {
            return failure(res, 401, 'errors', 'Error 401 - Coaster not found');
        };
        // If there are any errors, redisplay the form page with errors at the top
        if (!errors.isEmpty()) {
            // If errors were found in middleware/validateCoaster.js, it will redisplay the page with the errors at the top
            return failure(res, 400, 'updateCoasterForm', `Update ${coaster.name}`, errors.array(), coaster);
        };
        // Receive sanitized and verified information and use it to update coaster entry in database
        const { coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, parkName } = matchedData(req);
        await db.updateExistingCoaster(coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, id, parkName);
        // Returns to main coaster page after submitting
        return success(res, 200, '/coaster');
    } catch (err) {
        if (err.code === '23505') {
            return failure(res, 409, 'errors', 'Error 409 - Coaster already exists')
        };

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
            return failure(res, 401, 'errors', 'Error 401 - Coaster not found');
        };
        // Renders coaster data page with the selected coaster ID
        return success(res, 200, 'coasterData', coaster.name, coaster);
    } catch (err) {
        next(err);
    };
};

// Deletes the appropriate coaster from database based on an ID passed through in req.params
async function deleteSingleCoaster(req, res, next) {
    try {
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;
        // Finds matching coaster in the database by ID
        const coaster = await db.findCoasterById(id);
        // If ID doesn't match any coasters, redirects to the error page
        if (!coaster) {
            return failure(res, 401, 'errors', 'Error 401 - Coaster not found');
        };
        // Deletes matching coaster in the database by ID
        await db.deleteCoasterById(id);
        // Returns to main coaster page after deleting
        return success(res, 204, '/coaster');
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
            return failure(res, 401, 'errors', 'Error 401 - Coaster not found');
        };
        // Renders add rider from coaster form
        return success(res, 200, 'addRiderFromCoasterForm', 'Add Coaster to Rider', coaster);
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
            return failure(res, 401, 'errors', 'Error 401 - Rider not found')
        };
        // Adds link through riders_coasters join table to connect the coaster ID with the rider ID
        await addCoasterToRiderById(coasterId, riderId);
        // Redirects back to the coaster that the add rider from coaster form was initialized from
        return success(res, 201, `/coaster/${coasterId}`);
    } catch (err) {
        if (err.code === '23505') {
            return failure(res, 409, 'errors', 'Error 409 - Coaster already in rider list')
        };

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
    putUpdatedCoaster,
    getAddToRiderForm,
    postCoasterToRider,
};