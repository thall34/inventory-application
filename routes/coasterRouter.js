const { Router } = require('express');
const coasterRouter = Router();
const coasterController = require('../controllers/coasterController');
const validateId = require('../middleware/validateId');
const validateCoaster = require('../middleware/validateCoaster');

coasterRouter.get('/', coasterController.getAllCoasters);
coasterRouter.get('/new', coasterController.getNewCoasterForm);
coasterRouter.post('/new', validateCoaster, coasterController.postNewCoaster);
coasterRouter.get('/update/:id', validateId, coasterController.getUpdateCoasterForm);
coasterRouter.post('/update/:id', validateId, validateCoaster, coasterController.postUpdatedCoaster);
coasterRouter.get('/:id', validateId, coasterController.getSingleCoaster);
coasterRouter.get('/delete/:id', validateId, coasterController.deleteSingleCoaster);
coasterRouter.get('/addToRider/:id', validateId, coasterController.getAddToRiderForm);
coasterRouter.post('/addToRider/:id', validateId, coasterController.postCoasterToRider);

module.exports = coasterRouter;