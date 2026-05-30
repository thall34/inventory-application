const { Router } = require('express');
const { body } = require('express-validator');
const riderRouter = Router();
const riderController = require('../controllers/riderController');

const validateRider = [
    body('riderName')
    .trim()
    .notEmpty().withMessage('Must include the name of the rider')
    .isLength({ max: 50 }).withMessage('Rider name too long'),
];

riderRouter.get('/', riderController.getAllRiders);
riderRouter.get('/new', riderController.getNewRiderForm);
riderRouter.post('/new', validateRider, riderController.postNewRider);
riderRouter.get('/update/:id', riderController.getUpdateRiderForm);
riderRouter.post('/update/:id', validateRider, riderController.postUpdatedRider);
riderRouter.get('/:id', riderController.getSingleRider);
riderRouter.get('/delete/:id', riderController.deleteSingleRider);
riderRouter.get('/addCoaster/:id', riderController.getAddCoasterForm);
riderRouter.post('/addCoaster/:id', riderController.postCoasterToRider);

module.exports = riderRouter;