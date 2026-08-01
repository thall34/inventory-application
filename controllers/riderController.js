const { validationResult, matchedData } = require('express-validator');
const { getCoasterIdFromName } = require('../models/coasterModels')
const db = require('../models/riderModels');
const success = require('../utils/success');
const failure = require('../utils/failure');

// Retrieves all riders from database and displays it on riders main page
async function getAllRiders(req, res, next) {
    try {
        const riders = await db.getAllRiders();
        return success(res, 200, 'allRiders', 'All Riders', riders);
    } catch (err) {
        next(err);
    };
};

// Retrieves the add new rider form
async function getNewRiderForm(req, res, next) {
    try {
        return success(res, 200, 'newRiderForm', 'Add New Rider');
    } catch (err) {
        next(err);
    };
};

// Adds a new rider to the database
async function postNewRider(req, res, next) {
    try {
        // Gets results from rider form validation in middleware/validateRider.js
        const errors = validationResult(req);
        // If there are any errors, redisplay the form page with errors at the top
        if (!errors.isEmpty()) {
            return failure(res, 400, 'newRiderForm', 'Add New Rider', errors.array());
        };
        // Receive sanitized and verified information and use it to create new rider entry in database
        const { riderName } = matchedData(req);
        await db.postNewRider(riderName);
        // Returns to main rider page after submitting
        return success(res, 201, '/rider');
    } catch (err) {
        if (err.code === '23505') {
            return failure(res, 409, 'errors', 'Error 409 - Park already exists')
        };

        next(err);
    };
};

// Retrieves the update rider form for the appropriate rider based on an ID passed through in req.params
async function getUpdateRiderForm(req, res, next) {
    try {
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;
        // Finds matching rider in the database by ID
        const rider = await db.findRiderById(id);
        // If ID doesn't match any riders, redirects to the error page
        if (!rider) {
            return failure(res, 401, 'errors', 'Error 401 - Rider not found');
        };
        // Once rider has been found, renders the update form with the rider details
        return success(res, 200, 'updateRiderForm', `Update ${rider.name}`, rider);
    } catch (err) {
        next(err);
    };
};

// Adds updated rider data to the database based on the id from the previous form retrieval
async function putUpdatedRider(req, res, next) {
    try {
        // Gets results from rider form validation in middleware/validateRider.js
        const errors = validationResult(req);
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;
        // Finds matching rider in the database by ID
        const rider = await db.findRiderById(id);
        // If ID doesn't match any riders, redirects to the error page
        if (!rider) {
            return failure(res, 401, 'errors', 'Error 401 - Rider not found');
        };
        // If there are any errors, redisplay the form page with errors at the top
        if (!errors.isEmpty()) {
            // If errors were found in middleware/validateRider.js, it will redisplay the page with the errors at the top
            return failure(res, 400, 'updateRiderForm', `Update ${rider.name}`, errors.array(), rider);
        };

        // Receive sanitized and verified information and use it to update rider entry in database
        const { riderName } = matchedData(req);
        await db.updateExistingRider(riderName, id);
        // Returns to main rider page after submitting
        return success(res, 200, '/rider');
    } catch (err) {
        if (err.code === '23505') {
            return failure(res, 409, 'errors', 'Error 409 - Park already exists')
        };

        next(err);
    };
};

// Retrieves a rider data page for the appropriate rider based on an ID passed through in req.params
async function getSingleRider(req, res, next) {
    try {
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;
        // Finds matching rider in the database by ID
        const rider = await db.findRiderById(id);
        // If ID doesn't match any riders, redirects to the error page
        if (!rider) {
            return failure(res, 401, 'errors', 'Error 401 - Rider not found');
        };
        // Renders rider data page with the selected rider ID
        return success(res, 200, 'riderData', rider.name, rider);
    } catch (err) {
        next(err);
    };
};

// Deletes the appropriate rider from database based on an ID passed through in req.params
async function deleteSingleRider(req, res, next) {
    try {
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;
        // Finds matching rider in the database by ID
        const rider = await db.findRiderById(id);
        // If ID doesn't match any riders, redirects to the error page
        if (!rider) {
            return failure(res, 401, 'errors', 'Error 401 - Rider not found');
        };
        // Deletes matching rider in the database by ID
        await db.deleteRiderById(id);
        // Returns to main rider page after deleting
        return success(res, 204, '/rider');
    } catch (err) {
        next(err);
    };
};

// Retrieves the add coaster to rider form using an ID passed through in req.params
async function getAddCoasterForm(req, res, next) {
    try {
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;
        // Finds matching rider in the database by ID
        const rider = await db.findRiderById(id);
        // If ID doesn't match any riders, redirects to the error page
        if (!rider) {
            return (res, 401, 'errors', 'Error 401 - Rider not found');
        };
        // Renders add coaster to rider form
        return success(res, 200, 'addCoasterToRiderForm', 'Add Coaster to Rider', rider);
    } catch (err) {
        next(err);
    };
};

// Adds connection in rider/coaster join table through the appropriate rider ID passed through in req.params 
// and the coaster ID passed through in the add rider to coaster form's req.body
async function postCoasterToRider(req, res, next) {
    try {
        // Receives validated ID from middleware/validateId.js
        const riderId = req.validatedId;
        // Receives coasterName from the post method of the add rider from coaster form
        const { coasterName } = req.body;
        // Finds matching coaster in the database by ID
        const coasterId = await getCoasterIdFromName(coasterName);
        // If coasterId doesn't match any riders, redirects to the error page
        if (!coasterId) {
            return failure(res, 401, 'errors', 'Error 401 - Coaster not found');
        };
        // Adds link through riders_coasters join table to connect the coaster ID with the rider ID
        await db.addCoasterToRiderById(coasterId, riderId);
        // Redirects back to the rider that the add coaster to rider form was initialized from
        return success(res, 201, `/rider/${riderId}`);
    } catch (err) {
        if (err.code === '23505') {
            return failure(res, 409, 'errors', 'Error 409 - Coaster already in rider list')
        };

        next(err);
    };
};

module.exports = {
    getAllRiders,
    getNewRiderForm,
    postNewRider,
    getUpdateRiderForm,
    putUpdatedRider,
    getSingleRider,
    deleteSingleRider,
    postCoasterToRider,
    getAddCoasterForm,
};