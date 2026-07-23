const express = require('express');

const controller = require('../controllers/weather.controller');

const router = express.Router();

router.get('/:destinationId', controller.getWeather);

module.exports = router;
