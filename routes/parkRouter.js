const { Router } = require('express');
const { body } = require('express-validator');
const parkRouter = Router();
const parkController = require('../controllers/parkController');

const validatePark = [
    body('parkName')
    .trim()
    .notEmpty().withMessage('Must include the name of the park')
    .isLength({ max: 100 }).withMessage('Park name too long'),
];

parkRouter.get('/', parkController.getAllParks);
parkRouter.get('/new', parkController.getNewParkForm);
parkRouter.post('/new', validatePark, parkController.postNewPark);
parkRouter.get('/update/:id', parkController.getUpdateParkForm);
parkRouter.post('/update/:id', validatePark, parkController.postUpdatedPark);
parkRouter.get('/:id', parkController.getSinglePark);
parkRouter.get('/delete/:id', parkController.deleteSinglePark);

module.exports = parkRouter;