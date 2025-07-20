const express = require('express');
const viewsControlloer = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewsControlloer.getOverview);

router.get('/tour/:slug', viewsControlloer.getTour);

router.get('/login', viewsControlloer.getLoginForm);

module.exports = router;
