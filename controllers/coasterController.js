const testArray = [
    {
        id: 1,
        name: 'Behemoth',
        inversions: 0,
        speed: 77,
        height: 230,
        length: 5318,
    },
    {
        id: 2,
        name: 'Leviathan',
        inversions: 0,
        speed: 92,
        height: 306,
        length: 5486,
    },
];

function getAllCoasters(req, res) {
    res.render('allCoasters', {
        title: 'Coaster Info',
        coasters: testArray,
    });
};

function getNewCoasterForm(req, res) {
    res.render('newCoasterForm', {
        title: 'Add New Coaster',
    });
};

function postNewCoaster(req, res) {
    const { coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength } = req.body;
    const id = testArray.length + 1;
    testArray.push({ 
        id: id,
        name: coasterName, 
        inversions: coasterInversions, 
        speed: coasterSpeed, 
        height: coasterHeight, 
        length: coasterLength, 
    });

    res.redirect('/coaster');
};

function getUpdateCoasterForm(req, res) {
    const id = Number(req.params.id);
    const coaster = testArray.find((coaster) => coaster.id === id);
    res.render('updateCoasterForm', {
        title: 'Update Coaster',
        coaster: coaster,
    });
};

function postUpdatedCoaster(req, res) {
    const { coasterName, coasterInversions, coasterSpeed, coasterHeight, coasterLength } = req.body;
    const id = Number(req.params.id);
    const coasterId = testArray.findIndex((coaster) => coaster.id === id);
    if (coasterId < 0) {
        return;
    };

    testArray[coasterId] = {
        id: id,
        name: coasterName, 
        inversions: coasterInversions, 
        speed: coasterSpeed, 
        height: coasterHeight, 
        length: coasterLength,            
    };

    res.redirect('/coaster');
};

function getSingleCoaster(req, res) {
    const id = Number(req.params.id);
    const coaster = testArray.find((coaster) => coaster.id === id);
    if (!coaster) {
        return;
    }

    res.render('coasterData', {
        title: 'Coaster Data',
        coaster: coaster,
    });
};

function deleteSingleCoaster(req, res) {
    const id = Number(req.params.id);
    const coasterId = testArray.findIndex((coaster) => coaster.id === id);
    if (coasterId < 0) {
        return;
    };

    testArray.splice(coasterId, 1);
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