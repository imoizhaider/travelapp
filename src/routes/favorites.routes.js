const express = require('express');

const controller = require('../controllers/favorites.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);
router.get('/', controller.listFavorites);
router.post('/destinations/:destinationId', controller.addFavoriteDestination);
router.delete('/destinations/:destinationId', controller.removeFavoriteDestination);
router.post('/hotels/:hotelId', controller.addFavoriteHotel);
router.delete('/hotels/:hotelId', controller.removeFavoriteHotel);
router.post('/attractions/:attractionId', controller.addFavoriteAttraction);
router.delete('/attractions/:attractionId', controller.removeFavoriteAttraction);

module.exports = router;
