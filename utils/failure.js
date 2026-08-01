function failure(res, status, view, title, error, data) {
    if (!error) {
        return res.status(status).render(view, {
            title: title,
        });
    };

    if (!data) {
        return res.status(status).render(view, {
            title: title,
            error: error,
        });
    };

    return res.status(status).render(view, {
        title: error,
        error: error,
        data: data,
    });
};

module.exports = failure;