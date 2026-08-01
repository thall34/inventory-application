function success(res, status, view, title, data) {
    if (!title) {
        return res.status(status).redirect(view);
    };

    if (!data) {
        return res.status(status).render(view, {
            title: title,
        });
    };

    return res.status(status).render(view, {
        title: title,
        data: data,
    });
};

module.exports = success;