const { Router } = require('express');
const { body } = require('express-validator');
const coasterRouter = Router();
const coasterController = require('../controllers/coasterController');

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
    .notEmpty().withMessage('inversion count is required')
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

coasterRouter.get('/', coasterController.getAllCoasters);
coasterRouter.get('/new', coasterController.getNewCoasterForm);
coasterRouter.post('/new', validateCoaster, coasterController.postNewCoaster);
coasterRouter.get('/update/:id', coasterController.getUpdateCoasterForm);
coasterRouter.post('/update/:id', validateCoaster, coasterController.postUpdatedCoaster);
coasterRouter.get('/:id', coasterController.getSingleCoaster);
coasterRouter.get('/delete/:id', coasterController.deleteSingleCoaster);
coasterRouter.get('/addToRider/:id', coasterController.getAddToRiderForm);
coasterRouter.post('/addToRider/:id', coasterController.postCoasterToRider);

module.exports = coasterRouter;