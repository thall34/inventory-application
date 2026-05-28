const { Router } = require('express');
const riderRouter = Router();
const riderController = require('../controllers/riderController');

riderRouter.get('/', riderController.getAllRiders);
riderRouter.get('/new', riderController.getNewRiderForm);
riderRouter.post('/new', riderController.postNewRider);
riderRouter.get('/update/:id', riderController.getUpdateRiderForm);
riderRouter.post('/update/:id', riderController.postUpdatedRider);
riderRouter.get('/:id', riderController.getSingleRider);
riderRouter.get('/delete/:id', riderController.deleteSingleRider);

module.exports = riderRouter;