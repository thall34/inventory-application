const { post } = require("../routes/indexRouter");

const testArray = [
    {
        id: 1,
        name: 'Tyler Hall',
    },
    {
        id: 2,
        name: 'Amber Hall',
    },
];

function getRiderPage(req, res) {
    res.render('allRiders', {
        title: 'Rider Info',
        riders: testArray,
    });
};

function getNewRiderForm(req, res) {
    res.render('newRiderForm', {
        title: 'Add New Rider',
    });
};

function postNewRider(req, res) {
    const { riderName } = req.body;
    const id = testArray.length + 1;
    testArray.push({ 
        id: id,
        name: riderName, 
    });

    res.redirect('/rider');
};

function getUpdateRiderForm(req, res) {
    const id = Number(req.params.id);
    const rider = testArray.find((rider) => rider.id === id);
    res.render('updateRiderForm', {
        title: 'Update Rider',
        rider: rider,
    });
};

function postUpdatedRider(req, res) {
    const { riderName } = req.body;
    const id = Number(req.params.id);
    const riderId = testArray.findIndex((rider) => rider.id === id);
    if (riderId < 0) {
        return;
    };

    testArray[riderId] = {
        id: id,
        name: riderName,           
    };

    res.redirect('/rider');
};

function getSinglerider(req, res) {
    const id = Number(req.params.id);
    const rider = testArray.find((rider) => rider.id === id);
    res.render('riderData', {
        title: 'Rider Data',
        rider: rider,
    });
};

function deleteSinglerider(req, res) {
    const id = Number(req.params.id);
    const riderId = testArray.findIndex((rider) => rider.id === id);
    if (riderId < 0) {
        return;
    };

    testArray.splice(riderId, 1);
    res.redirect('/rider');
};

module.exports = {
    getRiderPage,
    getNewRiderForm,
    postNewRider,
    getUpdateRiderForm,
    postUpdatedRider,
    getSinglerider,
    deleteSinglerider,
};