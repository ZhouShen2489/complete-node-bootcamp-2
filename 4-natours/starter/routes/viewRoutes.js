const express = require('express');
const viewsControlloer = require('../controllers/viewsController');

const router = express.Router();

router.get('/', viewsControlloer.getOverview);

router.get('/tour', viewsControlloer.getTour);

module.exports = router;
