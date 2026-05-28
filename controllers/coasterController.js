const db = require('../db/queries');

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
    const { coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength } = req.body;
    await db.postNewCoaster(coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength);
    res.redirect('/coaster');
};

async function getUpdateCoasterForm(req, res) {
    const id = Number(req.params.id);
    const coaster = await db.findCoasterById(id);
    res.render('updateCoasterForm', {
        title: 'Update Coaster',
        coaster: coaster,
    });
};

async function postUpdatedCoaster(req, res) {
    const { coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength } = req.body;
    const id = Number(req.params.id);
    await db.updateExistingCoaster(coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength, id)
    res.redirect('/coaster');
};

async function getSingleCoaster(req, res) {
    const id = Number(req.params.id);
    const coaster = await db.findCoasterById(id);
    res.render('coasterData', {
        title: 'Coaster Data',
        coaster: coaster,
    });
};

async function deleteSingleCoaster(req, res) {
    const id = Number(req.params.id);
    await db.deleteCoasterById(id);
    res.redirect('/coaster');
};

module.exports = {
    getAllCoasters,
    getNewCoasterForm,
    postNewCoaster,
    getSingleCoaster,
    deleteSingleCoaster,
    getUpdateCoasterForm,
    postUpdatedCoaster,
};