const { body } = require('express-validator');

const validateCoaster = [
    body('coasterName')
    .trim()
    .notEmpty().withMessage('Must include the name of the roller coaster')
    .isLength({ max: 100 }).withMessage('Coaster name too long'),
    body('parkName')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Park name too long'),
    body('coasterInversions')
    .trim()
    .notEmpty().withMessage('Inversion count is required')
    .isInt({ min: 0 }).withMessage('Must be a number greater than or equal to 0')
    .toInt(),
    body('coasterSpeed')
    .trim()
    .notEmpty().withMessage('Speed is required')
    .isInt({ min: 0 }).withMessage('Must be a number greater than or equal to 0')
    .toInt(),
    body('coasterHeight')
    .trim()
    .notEmpty().withMessage('Height is required')
    .isInt({ min: 0 }).withMessage('Must be a number greater than or equal to 0')
    .toInt(),
    body('coasterLength')
    .trim()
    .notEmpty().withMessage('Length is required')
    .isInt({ min: 0 }).withMessage('Must be a number greater than or equal to 0')
    .toInt(),
];

module.exports = validateCoaster;