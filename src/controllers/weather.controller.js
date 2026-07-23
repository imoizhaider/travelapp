const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { weatherQueries } = require('../db/queries');

const getWeather = asyncHandler(async (req, res) => {
  const destinationId = Number(req.params.destinationId);
  const forecastDate = req.query.date || null;
  const result = await pool.query(weatherQueries.getByDestination, [destinationId, forecastDate]);
  res.json({ success: true, data: result.rows });
});

module.exports = {
  getWeather
};
