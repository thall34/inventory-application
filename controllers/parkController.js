const { validationResult, matchedData } = require('express-validator');
const db = require('../db/parkQueries');

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

async function getNewParkForm(req, res, next) {
    try {
        res.render('newParkForm', {
            title: 'Add New Park',
        });

    } catch (err) {
        next(err);
    };
};

async function postNewPark(req, res, next) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render('newParkForm', {
                title: 'Add New Coaster',
                errors: errors.array(),
            });
        };

        const { parkName } = matchedData(req);
        await db.postNewPark(parkName);
        res.redirect('/park');

    } catch (err) {
        next(err);
    };
};

async function getUpdateParkForm(req, res, next) {
    try {
        const id = req.validatedId;

        const park = await db.findParkById(id);

        if (!park) {
            return res.status(404).render('404');
        };

        res.render('updateParkForm', {
            title: 'Update Park',
            park: park,
        });

    } catch (err) {
        next(err);
    };
};

async function postUpdatedPark(req, res, next) {
    try {
        const errors = validationResult(req);
        const id = req.validatedId;

        if (!errors.isEmpty()) {
            const park = await db.findParkById(id);

            if (!park) {
                return res.status(404).render('404');
            };

            return res.status(400).render('updateParkForm', {
                title: 'Update Park',
                park: park,
                errors: errors.array(),
            });
        };

        const { parkName } = matchedData(req);

        await db.updateExistingPark(parkName, id)
        res.redirect('/park');

    } catch (err) {
        next(err);
    };
};

async function getSinglePark(req, res, next) {
    try {
        const id = req.validatedId;

        const park = await db.findParkById(id);

        if (!park) {
            return res.status(404).render('404');
        };

        res.render('parkData', {
            title: 'Park Data',
            park: park,
        });

    } catch (err) {
        next(err);
    };
};

async function deleteSinglePark(req, res, next) {
    try {
        const id = req.validatedId;

        await db.deleteParkById(id);
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