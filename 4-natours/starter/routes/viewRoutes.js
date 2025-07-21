const express = require('express');
const viewsControlloer = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsControlloer.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewsControlloer.getTour);

router.get('/login', authController.isLoggedIn, viewsControlloer.getLoginForm);

router.get('/me', authController.protect, viewsControlloer.getAccount);

module.exports = router;
