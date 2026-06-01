const { body } = require('express-validator');

const validateRider = [
    body('riderName')
    .trim()
    .notEmpty().withMessage('Must include the name of the rider')
    .isLength({ max: 50 }).withMessage('Rider name too long'),
];

module.exports = validateRider;