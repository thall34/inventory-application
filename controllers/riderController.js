const db = require('../db/queries');

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

// function postNewRider(req, res) {
//     const { riderName } = req.body;
//     const id = testArray.length + 1;
//     testArray.push({ 
//         id: id,
//         name: riderName, 
//     });

//     res.redirect('/rider');
// };

// function getUpdateRiderForm(req, res) {
//     const id = Number(req.params.id);
//     const rider = testArray.find((rider) => rider.id === id);
//     res.render('updateRiderForm', {
//         title: 'Update Rider',
//         rider: rider,
//     });
// };

// function postUpdatedRider(req, res) {
//     const { riderName } = req.body;
//     const id = Number(req.params.id);
//     const riderId = testArray.findIndex((rider) => rider.id === id);
//     if (riderId < 0) {
//         return;
//     };

//     testArray[riderId] = {
//         id: id,
//         name: riderName,           
//     };

//     res.redirect('/rider');
// };

// function getSinglerider(req, res) {
//     const id = Number(req.params.id);
//     const rider = testArray.find((rider) => rider.id === id);
//     res.render('riderData', {
//         title: 'Rider Data',
//         rider: rider,
//     });
// };

// function deleteSinglerider(req, res) {
//     const id = Number(req.params.id);
//     const riderId = testArray.findIndex((rider) => rider.id === id);
//     if (riderId < 0) {
//         return;
//     };

//     testArray.splice(riderId, 1);
//     res.redirect('/rider');
// };

async function postNewRider(req, res) {
    const { riderName } = req.body;
    await db.postNewRider(riderName);
    res.redirect('/rider');
};

async function getUpdateRiderForm(req, res) {
    const id = Number(req.params.id);
    const rider = await db.findRiderById(id);
    res.render('updateRiderForm', {
        title: 'Update Rider',
        rider: rider,
    });
};

async function postUpdatedRider(req, res) {
    const { riderName } = req.body;
    const id = Number(req.params.id);
    console.log()
    await db.updateExistingRider(riderName, id)
    res.redirect('/rider');
};

async function getSingleRider(req, res) {
    const id = Number(req.params.id);
    const rider = await db.findRiderById(id);
    res.render('riderData', {
        title: 'Rider Data',
        rider: rider,
    });
};

async function deleteSingleRider(req, res) {
    const id = Number(req.params.id);
    await db.deleteRiderById(id);
    res.redirect('/rider');
};

module.exports = {
    getAllRiders,
    getNewRiderForm,
    postNewRider,
    getUpdateRiderForm,
    postUpdatedRider,
    getSingleRider,
    deleteSingleRider,
};