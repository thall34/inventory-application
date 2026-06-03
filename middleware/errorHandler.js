function errorHandler(err, req, res, next) {
    console.error(err);

    // postSQL Database errors
    if(err.code) {
        return res.status(500).render('errors', {
            title: 'Error 500 - Database error occured',
            message: 'Error - 500: Database error occured',
        });
    };

    // fallback to catch all errors
    return res.status(500).render('errors', {
            title: 'Error 500 - Database error occured',
            message: 'Error - 500: Database error occured',
    });
};

module.exports = errorHandler;