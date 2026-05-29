const { Router } = require('express');
const coasterRouter = Router();
const coasterController = require('../controllers/coasterController');

coasterRouter.get('/', coasterController.getAllCoasters);
coasterRouter.get('/new', coasterController.getNewCoasterForm);
coasterRouter.post('/new', coasterController.postNewCoaster);
coasterRouter.get('/update/:id', coasterController.getUpdateCoasterForm);
coasterRouter.post('/update/:id', coasterController.postUpdatedCoaster);
coasterRouter.get('/:id', coasterController.getSingleCoaster);
coasterRouter.get('/delete/:id', coasterController.deleteSingleCoaster);
coasterRouter.get('/addToRider/:id', coasterController.getAddToRiderForm);
coasterRouter.post('/addToRider/:id', coasterController.postCoasterToRider);

module.exports = coasterRouter;