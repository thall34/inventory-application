// Displays homepage
async function getHomepage(req, res, next) {
    try {
        res.render('index', {
            title: 'Roller Coaster Database'
        });

    } catch (err) {
        next(err);
    };
};

module.exports = {
    getHomepage,
};