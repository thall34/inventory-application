const { Router } = require('express');
const coasterRouter = Router();
const coasterController = require('../controllers/coasterController');
const validateId = require('../middleware/validateId');
const validateCoaster = require('../middleware/validateCoaster');

coasterRouter.get('/', coasterController.getAllCoasters);
coasterRouter.get('/new', coasterController.getNewCoasterForm);
coasterRouter.get('/update/:id', validateId, coasterController.getUpdateCoasterForm);
coasterRouter.get('/addToRider/:id', validateId, coasterController.getAddToRiderForm);
coasterRouter.get('/delete/:id', validateId, coasterController.deleteSingleCoaster);
coasterRouter.get('/:id', validateId, coasterController.getSingleCoaster);
coasterRouter.post('/new', validateCoaster, coasterController.postNewCoaster);
coasterRouter.post('/addToRider/:id', validateId, coasterController.postCoasterToRider);
coasterRouter.post('/update/:id', validateId, validateCoaster, coasterController.putUpdatedCoaster);

module.exports = coasterRouter;