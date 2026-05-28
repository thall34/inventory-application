const { Router } = require('express');
const riderRouter = Router();
const riderController = require('../controllers/riderController');

riderRouter.get('/', riderController.getRiderPage);
riderRouter.get('/new', riderController.getNewRiderForm);
riderRouter.post('/new', riderController.postNewRider);
riderRouter.get('/update/:id', riderController.getUpdateRiderForm);
riderRouter.post('/update/:id', riderController.postUpdatedRider);
riderRouter.get('/:id', riderController.getSinglerider);
riderRouter.get('/delete/:id', riderController.deleteSinglerider);

module.exports = riderRouter;