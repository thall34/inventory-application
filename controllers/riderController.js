const { validationResult, matchedData } = require('express-validator');
const { getCoasterIdFromName } = require('../db/coasterQueries')
const db = require('../db/riderQueries');

async function getAllRiders(req, res) {
    const riders = await db.getAllRiders();
    res.render('allRiders', {
        title: 'All Riders',
        riders: riders,
    });
};

function getNewRiderForm(req, res) {
    res.render('newRiderForm', {
        title: 'Add New Rider',
    });
};

async function postNewRider(req, res) {
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
};

async function getUpdateRiderForm(req, res) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).send('Invalid ID');
    };
    
    const rider = await db.findRiderById(id);

    if (!rider) {
        return res.status(404).render('404');
    };

    res.render('updateRiderForm', {
        title: 'Update Rider',
        rider: rider,
    });
};

async function postUpdatedRider(req, res) {
    const errors = validationResult(req);

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).send('Invalid ID');
    };
    
    if (!errors.isEmpty()) {
        const rider = await db.findRiderById(id);

        if(!rider) {
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
};

async function getSingleRider(req, res) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).send('Invalid ID');
    };

    const rider = await db.findRiderById(id);

    if (!rider) {
        return res.status(404).render('404');
    };

    res.render('riderData', {
        title: 'Rider Data',
        rider: rider,
    });
};

async function deleteSingleRider(req, res) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).send('Invalid ID');
    };

    await db.deleteRiderById(id);
    res.redirect('/rider');
};

async function getAddCoasterForm(req, res) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).send('Invalid ID');
    };
    
    const rider = await db.findRiderById(id);

    if (!rider) {
        return res.status(404).render('404');
    };

    res.render('addCoasterToRiderForm', {
        title: 'Add Coaster to Rider',
        rider: rider,
    });
};

async function postCoasterToRider(req, res) {
    const riderId = Number(req.params.id);

    if (Number.isNaN(riderId)) {
        return res.status(400).send('Invalid ID');
    };

    const { coasterName } = req.body;
    const coasterId = await getCoasterIdFromName(coasterName);

    if (!coasterId) {
        return res.status(404).send('Coaster not found');
    };

    await db.addCoasterToRiderById(coasterId, riderId);
    res.redirect(`/rider/${riderId}`);
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