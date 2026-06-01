const db = require('../db/coasterQueries');
const { getRiderIdFromName, addCoasterToRiderById } = require('../db/riderQueries');
const { validationResult, matchedData } = require('express-validator');

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

async function getNewCoasterForm(req, res, next) {
    try {
        res.render('newCoasterForm', {
            title: 'Add New Coaster',
        });

    } catch (err) {
        next(err);
    };
};

async function postNewCoaster(req, res, next) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render('newCoasterForm', {
                title: 'Add New Coaster',
                errors: errors.array()
            });
        };

        const { coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, parkName } = matchedData(req);
        await db.postNewCoaster(coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, parkName);
        res.redirect('/coaster');

    } catch (err) {
        next(err);
    };
};

async function getUpdateCoasterForm(req, res, next) {
    try {
        const id = req.validatedId;

        const coaster = await db.findCoasterById(id);

        if (!coaster) {
            return res.status(404).render('404');
        };

        res.render('updateCoasterForm', {
            title: 'Update Coaster',
            coaster: coaster,
        });

    } catch (err) {
        next(err);
    };
};

async function postUpdatedCoaster(req, res, next) {
    try {
        const errors = validationResult(req);
        const id = req.validatedId;

        if (!errors.isEmpty()) {
            const coaster = await db.findCoasterById(id);

            if (!coaster) {
                return res.status(404).render('404');
            };

            return res.status(400).render('updateCoasterForm', {
                title: 'Update Coaster',
                coaster: coaster,
                errors: errors.array(),
            });
        };

        const { coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, parkName } = matchedData(req);

        await db.updateExistingCoaster(coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, id, parkName);
        res.redirect('/coaster');

    } catch (err) {
        next(err);
    };
};

async function getSingleCoaster(req, res, next) {
    try {
        const id = req.validatedId;

        const coaster = await db.findCoasterById(id);

        if (!coaster) {
            return res.status(404).render('404');
        };

        res.render('coasterData', {
            title: 'Coaster Data',
            coaster: coaster,
        });

    } catch (err) {
        next(err);
    };
};

async function deleteSingleCoaster(req, res, next) {
    try {
        const id = req.validatedId;

        await db.deleteCoasterById(id);
        res.redirect('/coaster');

    } catch (err) {
        next(err);
    };
};

async function getAddToRiderForm(req, res, next) {
    try {
        const id = req.validatedId;

        const coaster = await db.findCoasterById(id);

        if (!coaster) {
            return res.status(404).render('404');
        };

        res.render('addRiderFromCoasterForm', {
            title: 'Add Coaster to Rider',
            coaster: coaster,
        });

    } catch (err) {
        next(err);
    };
};

async function postCoasterToRider(req, res, next) {
    try {
        const coasterId = req.validatedId;

        const { riderName } = req.body;
        const riderId = await getRiderIdFromName(riderName);

        if (!riderId) {
            return res.status(404).send('Rider not found');
        };

        await addCoasterToRiderById(coasterId, riderId);
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