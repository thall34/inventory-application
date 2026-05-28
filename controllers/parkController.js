const testArray = [
    {
        id: 1,
        name: 'Canada\'s Wonderland',   
    },
    {
        id: 2,
        name: 'Cedar Point',   
    },
];

function getParkPage(req, res) {
    res.render('allParks', {
        title: 'Park Info',
        parks: testArray,
    });
};

function getNewParkForm(req, res) {
    res.render('newParkForm', {
        title: 'Add New Park',
    });
};

function postNewPark(req, res) {
    const { parkName } = req.body;
    const id = testArray.length + 1;
    testArray.push({ 
        id: id,
        name: parkName, 
    });

    res.redirect('/park');
};

function getUpdateParkForm(req, res) {
    const id = Number(req.params.id);
    const park = testArray.find((park) => park.id === id);
    res.render('updateParkForm', {
        title: 'Update Park',
        park: park,
    });
};

function postUpdatedPark(req, res) {
    const { parkName } = req.body;
    const id = Number(req.params.id);
    const parkId = testArray.findIndex((park) => park.id === id);
    if (parkId < 0) {
        return;
    };

    testArray[parkId] = {
        id: id,
        name: parkName,           
    };

    res.redirect('/park');
};

function getSinglePark(req, res) {
    const id = Number(req.params.id);
    const park = testArray.find((park) => park.id === id);
    res.render('parkData', {
        title: 'Park Data',
        park: park,
    });
};

function deleteSinglePark(req, res) {
    const id = Number(req.params.id);
    const parkId = testArray.findIndex((park) => park.id === id);
    if (parkId < 0) {
        return;
    };

    testArray.splice(parkId, 1);
    res.redirect('/park');
};

module.exports = {
    getParkPage,
    getNewParkForm,
    postNewPark,
    getUpdateParkForm,
    postUpdatedPark,
    getSinglePark,
    deleteSinglePark,
};