// validates id from request parameters and ensures that it returns a numerical id for other functions
function validateId(req, res, next) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).render('errors', {
            title: 'Error 400 - Invalid ID',
            message: 'Error 400 - Invalid ID',
        });
    };

    req.validatedId = id;
    next();
};

module.exports = validateId;