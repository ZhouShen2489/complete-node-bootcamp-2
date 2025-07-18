const express = require('express');
const viewsControlloer = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', viewsControlloer.getOverview);

router.get('/tour/:slug', authController.protect, viewsControlloer.getTour);

router.get('/login', viewsControlloer.getLoginForm);

module.exports = router;
