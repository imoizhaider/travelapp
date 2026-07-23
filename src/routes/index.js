const express = require('express');

const authRoutes = require('./auth.routes');
const destinationsRoutes = require('./destinations.routes');
const tripsRoutes = require('./trips.routes');
const itinerariesRoutes = require('./itineraries.routes');
const favoritesRoutes = require('./favorites.routes');
const weatherRoutes = require('./weather.routes');
const budgetRoutes = require('./budget.routes');
const hotelsRoutes = require('./hotels.routes');
const sharingRoutes = require('./sharing.routes');
const usersRoutes = require('./users.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/destinations', destinationsRoutes);
router.use('/trips', tripsRoutes);
router.use('/', itinerariesRoutes);
router.use('/me/favorites', favoritesRoutes);
router.use('/weather', weatherRoutes);
router.use('/', budgetRoutes);
router.use('/', hotelsRoutes);
router.use('/', sharingRoutes);
router.use('/users', usersRoutes);

module.exports = router;
