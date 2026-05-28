function getHomepage(req, res) {
    res.render('index', {
        title: 'Roller Coaster Database'
    });
};

module.exports = {
    getHomepage,
};