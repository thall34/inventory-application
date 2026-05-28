const { Router } = require('express');
const parkRouter = Router();
const parkController = require('../controllers/parkController');

parkRouter.get('/', parkController.getParkPage);
parkRouter.get('/new', parkController.getNewParkForm);
parkRouter.post('/new', parkController.postNewPark);
parkRouter.get('/update/:id', parkController.getUpdateParkForm);
parkRouter.post('/update/:id', parkController.postUpdatedPark);
parkRouter.get('/:id', parkController.getSinglePark);
parkRouter.get('/delete/:id', parkController.deleteSinglePark);

module.exports = parkRouter;