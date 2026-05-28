const db = require('../db/queries');

async function getAllParks(req, res) {
    const parks = await db.getAllParks();
    res.render('allParks', {
        title: 'All Parks',
        parks: parks,
    });
};

function getNewParkForm(req, res) {
    res.render('newParkForm', {
        title: 'Add New Park',
    });
};

async function postNewPark(req, res) {
    const { parkName } = req.body;
    await db.postNewPark(parkName);
    res.redirect('/park');
};

async function getUpdateParkForm(req, res) {
    const id = Number(req.params.id);
    const park = await db.findParkById(id);
    res.render('updateParkForm', {
        title: 'Update Park',
        park: park,
    });
};

async function postUpdatedPark(req, res) {
    const { parkName } = req.body;
    const id = Number(req.params.id);
    await db.updateExistingPark(parkName, id)
    res.redirect('/park');
};

async function getSinglePark(req, res) {
    const id = Number(req.params.id);
    const park = await db.findParkById(id);
    res.render('parkData', {
        title: 'Park Data',
        park: park,
    });
};

async function deleteSinglePark(req, res) {
    const id = Number(req.params.id);
    await db.deleteParkById(id);
    res.redirect('/park');
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