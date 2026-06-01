const { body } = require('express-validator');

const validatePark = [
    body('parkName')
    .trim()
    .notEmpty().withMessage('Must include the name of the park')
    .isLength({ max: 100 }).withMessage('Park name too long'),
];

module.exports = validatePark;