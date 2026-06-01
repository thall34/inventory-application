const { validationResult, matchedData } = require('express-validator');
const { getCoasterIdFromName } = require('../db/coasterQueries')
const db = require('../db/riderQueries');

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

async function getNewRiderForm(req, res, next) {
    try {
        res.render('newRiderForm', {
            title: 'Add New Rider',
        });

    } catch (err) {
        next(err);
    };
};

async function postNewRider(req, res, next) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render('newRiderForm', {
                title: 'Add New Rider',
                errors: errors.array(),
            });
        };

        const { riderName } = matchedData(req);
        await db.postNewRider(riderName);
        res.redirect('/rider');

    } catch (err) {
        next(err);
    };
};

async function getUpdateRiderForm(req, res, next) {
    try {
        const id = req.validatedId;

        const rider = await db.findRiderById(id);

        if (!rider) {
            return res.status(404).render('404');
        };

        res.render('updateRiderForm', {
            title: 'Update Rider',
            rider: rider,
        });

    } catch (err) {
        next(err);
    };
};

async function postUpdatedRider(req, res, next) {
    try {
        const errors = validationResult(req);
        const id = req.validatedId;

        if (!errors.isEmpty()) {
            const rider = await db.findRiderById(id);

            if (!rider) {
                return res.status(404).render('404');
            };

            return res.status(400).render('updateRiderForm', {
                title: 'Update Rider',
                rider: rider,
                errors: errors.array(),
            });
        };

        const { riderName } = matchedData(req);

        await db.updateExistingRider(riderName, id)
        res.redirect('/rider');

    } catch (err) {
        next(err);
    };
};

async function getSingleRider(req, res, next) {
    try {
        const id = req.validatedId;

        const rider = await db.findRiderById(id);

        if (!rider) {
            return res.status(404).render('404');
        };

        res.render('riderData', {
            title: 'Rider Data',
            rider: rider,
        });

    } catch (err) {
        next(err);
    };
};

async function deleteSingleRider(req, res, next) {
    try {
        const id = req.validatedId;

        await db.deleteRiderById(id);
        res.redirect('/rider');

    } catch (err) {
        next(err);
    };
};

async function getAddCoasterForm(req, res, next) {
    try {
        const id = req.validatedId;

        const rider = await db.findRiderById(id);

        if (!rider) {
            return res.status(404).render('404');
        };

        res.render('addCoasterToRiderForm', {
            title: 'Add Coaster to Rider',
            rider: rider,
        });

    } catch (err) {
        next(err);
    };
};

async function postCoasterToRider(req, res, next) {
    try {
        const riderId = req.validatedId;

        const { coasterName } = req.body;
        const coasterId = await getCoasterIdFromName(coasterName);

        if (!coasterId) {
            return res.status(404).send('Coaster not found');
        };

        await db.addCoasterToRiderById(coasterId, riderId);
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