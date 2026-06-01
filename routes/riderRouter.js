const { Router } = require('express');
const riderRouter = Router();
const riderController = require('../controllers/riderController');
const validateRider = require('../middleware/validateRider');
const validateId = require('../middleware/validateId');

riderRouter.get('/', riderController.getAllRiders);
riderRouter.get('/new', riderController.getNewRiderForm);
riderRouter.post('/new', validateRider, riderController.postNewRider);
riderRouter.get('/update/:id', validateId, riderController.getUpdateRiderForm);
riderRouter.post('/update/:id', validateId, validateRider, riderController.postUpdatedRider);
riderRouter.get('/:id', validateId, riderController.getSingleRider);
riderRouter.get('/delete/:id', validateId, riderController.deleteSingleRider);
riderRouter.get('/addCoaster/:id', validateId, riderController.getAddCoasterForm);
riderRouter.post('/addCoaster/:id', validateId, riderController.postCoasterToRider);

module.exports = riderRouter;