const { validationResult, matchedData } = require('express-validator');
const { getCoasterIdFromName } = require('../db/coasterQueries')
const db = require('../db/riderQueries');

// Retrieves all riders from database and displays it on riders main page
async function getAllRiders(req, res, next) {
    try {
        const riders = await db.getAllRiders();
        res.render('allRiders', {
            title: 'All Riders',
            riders: riders,
        });

    } catch (err) {
        next(err);
    };
};

// Retrieves the add new rider form
async function getNewRiderForm(req, res, next) {
    try {
        res.render('newRiderForm', {
            title: 'Add New Rider',
        });

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
            return res.status(400).render('newRiderForm', {
                title: 'Add New Rider',
                errors: errors.array(),
            });
        };

        // Receive sanitized and verified information and use it to create new rider entry in database
        const { riderName } = matchedData(req);
        await db.postNewRider(riderName);
        // Returns to main rider page after submitting
        res.redirect('/rider');

    } catch (err) {
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
            return res.status(403).render('errors', {
                title: 'Error 403 - Rider not found',
                message: 'Error 402 - Rider not found in database',
            });
        };

        // Once rider has been found, renders the update form with the rider details
        res.render('updateRiderForm', {
            title: 'Update Rider',
            rider: rider,
        });

    } catch (err) {
        next(err);
    };
};

// Adds updated rider data to the database based on the id from the previous form retrieval
async function postUpdatedRider(req, res, next) {
    try {
        // Gets results from rider form validation in middleware/validateRider.js
        const errors = validationResult(req);
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;

        // If there are any errors, redisplay the form page with errors at the top
        if (!errors.isEmpty()) {
            // Finds matching rider in the database by ID
            const rider = await db.findRiderById(id);

            // If ID doesn't match any riders, redirects to the error page
            if (!rider) {
                return res.status(403).render('errors', {
                    title: 'Error 403 - Rider not found',
                    message: 'Error 402 - Rider not found in database',
                });
            };

            // If errors were found in middleware/validateRider.js, it will redisplay the page with the errors at the top
            return res.status(400).render('updateRiderForm', {
                title: 'Update Rider',
                rider: rider,
                errors: errors.array(),
            });
        };

        // Receive sanitized and verified information and use it to update rider entry in database
        const { riderName } = matchedData(req);
        await db.updateExistingRider(riderName, id);
        // Returns to main rider page after submitting
        res.redirect('/rider');

    } catch (err) {
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
            return res.status(403).render('errors', {
                title: 'Error 403 - Rider not found',
                message: 'Error 402 - Rider not found in database',
            });
        };

        // Renders rider data page with the selected rider ID
        res.render('riderData', {
            title: 'Rider Data',
            rider: rider,
        });

    } catch (err) {
        next(err);
    };
};

// Deletes the appropriate rider from database based on an ID passed through in req.params
async function deleteSingleRider(req, res, next) {
    try {
        // Receives validated ID from middleware/validateId.js
        const id = req.validatedId;

        // Deletes matching rider in the database by ID
        await db.deleteRiderById(id);
        // Returns to main rider page after deleting
        res.redirect('/rider');

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
            return res.status(403).render('errors', {
                title: 'Error 403 - Rider not found',
                message: 'Error 403 - Rider not found in database',
            });
        };

        // Renders add coaster to rider form
        res.render('addCoasterToRiderForm', {
            title: 'Add Coaster to Rider',
            rider: rider,
        });

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
            return res.status(401).render('errors', {
                title: 'Error 401 - Coaster not found',
                message: 'Error 401 - Coaster not found in database',
            });
        };

        // Adds link through riders_coasters join table to connect the coaster ID with the rider ID
        await db.addCoasterToRiderById(coasterId, riderId);
        // Redirects back to the rider that the add coaster to rider form was initialized from
        res.redirect(`/rider/${riderId}`);

    } catch (err) {
        next(err);
    };
};

module.exports = {
    getAllRiders,
    getNewRiderForm,
    postNewRider,
    getUpdateRiderForm,
    postUpdatedRider,
    getSingleRider,
    deleteSingleRider,
    postCoasterToRider,
    getAddCoasterForm,
};