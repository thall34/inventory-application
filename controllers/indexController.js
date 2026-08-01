const success = require('../utils/success');
// Displays homepage
async function getHomepage(req, res, next) {
    try {
        return success(res, 200, 'index', 'Roller Coaster Database');
    } catch (err) {
        next(err);
    };
};

module.exports = {
    getHomepage,
};