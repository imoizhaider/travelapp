const pool = require('../config/db');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { destinationQueries } = require('../db/queries');

const listDestinations = asyncHandler(async (req, res) => {
  const result = await pool.query(destinationQueries.list);
  res.json({ success: true, data: result.rows });
});

const getDestination = asyncHandler(async (req, res) => {
  const destinationId = Number(req.params.destinationId);
  const result = await pool.query(destinationQueries.getById, [destinationId]);

  if (!result.rows.length) {
    throw new ApiError(404, 'Destination not found');
  }

  res.json({ success: true, data: result.rows[0] });
});

const createDestination = asyncHandler(async (req, res) => {
  const body = req.validated.body;
  const result = await pool.query(destinationQueries.create, [
    body.destinationName,
    body.city,
    body.region || null,
    body.country,
    body.latitude || null,
    body.longitude || null,
    body.summary || null,
    body.averageCostLevel || null,
    body.popularityScore || null
  ]);

  res.status(201).json({ success: true, data: result.rows[0] });
});

const updateDestination = asyncHandler(async (req, res) => {
  const destinationId = Number(req.params.destinationId);
  const body = req.validated.body;
  const result = await pool.query(destinationQueries.update, [
    destinationId,
    body.destinationName || null,
    body.city || null,
    body.region || null,
    body.country || null,
    body.latitude ?? null,
    body.longitude ?? null,
    body.summary || null,
    body.averageCostLevel || null,
    body.popularityScore ?? null
  ]);

  if (!result.rows.length) {
    throw new ApiError(404, 'Destination not found');
  }

  res.json({ success: true, data: result.rows[0] });
});

const deleteDestination = asyncHandler(async (req, res) => {
  const destinationId = Number(req.params.destinationId);
  const result = await pool.query(destinationQueries.remove, [destinationId]);

  if (!result.rows.length) {
    throw new ApiError(404, 'Destination not found');
  }

  res.status(204).send();
});

module.exports = {
  listDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination
};
