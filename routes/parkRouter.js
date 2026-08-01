const { Router } = require('express');
const parkRouter = Router();
const parkController = require('../controllers/parkController');
const validatePark = require('../middleware/validatePark');
const validateId = require('../middleware/validateId');

parkRouter.get('/', parkController.getAllParks);
parkRouter.get('/new', parkController.getNewParkForm);
parkRouter.get('/update/:id', validateId, parkController.getUpdateParkForm);
parkRouter.get('/delete/:id', validateId, parkController.deleteSinglePark);
parkRouter.get('/:id', validateId, parkController.getSinglePark);
parkRouter.post('/new', validatePark, parkController.postNewPark);
parkRouter.post('/update/:id', validateId, validatePark, parkController.putUpdatedPark);

module.exports = parkRouter;