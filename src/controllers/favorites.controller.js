const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { favoritesQueries } = require('../db/queries');

const listFavorites = asyncHandler(async (req, res) => {
  const [destinations, hotels, attractions] = await Promise.all([
    pool.query(favoritesQueries.listDestinations, [req.user.userId]),
    pool.query(favoritesQueries.listHotels, [req.user.userId]),
    pool.query(favoritesQueries.listAttractions, [req.user.userId])
  ]);

  res.json({
    success: true,
    data: {
      destinations: destinations.rows,
      hotels: hotels.rows,
      attractions: attractions.rows
    }
  });
});

const addFavoriteDestination = asyncHandler(async (req, res) => {
  const destinationId = Number(req.params.destinationId);
  const result = await pool.query(favoritesQueries.addDestination, [req.user.userId, destinationId]);
  res.status(201).json({ success: true, data: result.rows[0] });
});

const removeFavoriteDestination = asyncHandler(async (req, res) => {
  const destinationId = Number(req.params.destinationId);
  await pool.query(favoritesQueries.removeDestination, [req.user.userId, destinationId]);
  res.status(204).send();
});

const addFavoriteHotel = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.hotelId);
  const result = await pool.query(favoritesQueries.addHotel, [req.user.userId, hotelId]);
  res.status(201).json({ success: true, data: result.rows[0] });
});

const removeFavoriteHotel = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.hotelId);
  await pool.query(favoritesQueries.removeHotel, [req.user.userId, hotelId]);
  res.status(204).send();
});

const addFavoriteAttraction = asyncHandler(async (req, res) => {
  const attractionId = Number(req.params.attractionId);
  const result = await pool.query('INSERT INTO favorite_attractions (user_id, attraction_id) VALUES ($1, $2) RETURNING *', [req.user.userId, attractionId]);
  res.status(201).json({ success: true, data: result.rows[0] });
});

const removeFavoriteAttraction = asyncHandler(async (req, res) => {
  const attractionId = Number(req.params.attractionId);
  await pool.query('DELETE FROM favorite_attractions WHERE user_id = $1 AND attraction_id = $2', [req.user.userId, attractionId]);
  res.status(204).send();
});

module.exports = {
  listFavorites,
  addFavoriteDestination,
  removeFavoriteDestination,
  addFavoriteHotel,
  removeFavoriteHotel,
  addFavoriteAttraction,
  removeFavoriteAttraction
};
