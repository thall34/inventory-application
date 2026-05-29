const db = require('../db/coasterQueries');

async function getAllCoasters(req, res) {
    const coasters = await db.getAllCoasters();
    res.render('allCoasters', {
        title: 'All Coasters',
        coasters: coasters,
    });
};

function getNewCoasterForm(req, res) {
    res.render('newCoasterForm', {
        title: 'Add New Coaster',
    });
};

async function postNewCoaster(req, res) {
    const { coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, parkName } = req.body;
    await db.postNewCoaster(coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, parkName);
    res.redirect('/coaster');
};

async function getUpdateCoasterForm(req, res) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).send('Invalid ID');
    };

    const coaster = await db.findCoasterById(id);

    if (!coaster) {
        return res.status(404).render('404');
    };

    res.render('updateCoasterForm', {
        title: 'Update Coaster',
        coaster: coaster,
    });
};

async function postUpdatedCoaster(req, res) {
    const { coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, parkName } = req.body;
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).send('Invalid ID');
    };

    await db.updateExistingCoaster(coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, id, parkName);
    res.redirect('/coaster');
};

async function getSingleCoaster(req, res) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).send('Invalid ID');
    };

    const coaster = await db.findCoasterById(id);

    if (!coaster) {
        return res.status(404).render('404');
    };

    res.render('coasterData', {
        title: 'Coaster Data',
        coaster: coaster,
    });
};

async function deleteSingleCoaster(req, res) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).send('Invalid ID');
    };

    await db.deleteCoasterById(id);
    res.redirect('/coaster');
};

async function getAddToRiderForm(req, res) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).send('Invalid ID');
    };

    const coaster = await db.findCoasterById(id);

    if (!coaster) {
        return res.status(404).render('404');
    };

    res.render('addRiderFromCoasterForm', {
        title: 'Add Coaster to Rider',
        coaster: coaster,
    });
};

async function postCoasterToRider(req, res) {
    const coasterId = Number(req.params.id);

    if (Number.isNaN(coasterId)) {
        return res.status(400).send('Invalid ID');
    };

    const { riderName } = req.body;
    const riderId = await db.getRiderIdFromName(riderName);
    
    if(!riderId) {
        return res.status(404).send('Rider not found');
    };

    await db.addCoasterToRiderById(coasterId, riderId);
    res.redirect(`/coaster/${coasterId}`);
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