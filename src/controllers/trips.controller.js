const pool = require('../config/db');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { tripQueries } = require('../db/queries');

const listTrips = asyncHandler(async (req, res) => {
  const result = await pool.query(tripQueries.listAccessible, [req.user.userId]);
  res.json({ success: true, data: result.rows });
});

const getTrip = asyncHandler(async (req, res) => {
  const tripId = Number(req.params.tripId);
  const result = await pool.query(tripQueries.getByIdAccessible, [tripId, req.user.userId]);

  if (!result.rows.length) {
    throw new ApiError(404, 'Trip not found or access denied');
  }

  res.json({ success: true, data: result.rows[0] });
});

const createTrip = asyncHandler(async (req, res) => {
  const body = req.validated.body;
  const result = await pool.query(tripQueries.create, [
    req.user.userId,
    body.destinationId,
    body.tripTitle,
    body.tripPurpose || null,
    body.startDate,
    body.endDate,
    body.travelerCount,
    body.tripStatus || 'draft'
  ]);

  res.status(201).json({ success: true, data: result.rows[0] });
});

const updateTrip = asyncHandler(async (req, res) => {
  const tripId = Number(req.params.tripId);
  const body = req.validated.body;
  const result = await pool.query(tripQueries.update, [
    tripId,
    body.destinationId ?? null,
    body.tripTitle || null,
    body.tripPurpose || null,
    body.startDate || null,
    body.endDate || null,
    body.travelerCount ?? null,
    body.tripStatus || null,
    req.user.userId
  ]);

  if (!result.rows.length) {
    throw new ApiError(404, 'Trip not found or you are not the owner');
  }

  res.json({ success: true, data: result.rows[0] });
});

const deleteTrip = asyncHandler(async (req, res) => {
  const tripId = Number(req.params.tripId);
  const result = await pool.query(tripQueries.remove, [tripId, req.user.userId]);

  if (!result.rows.length) {
    throw new ApiError(404, 'Trip not found or you are not the owner');
  }

  res.status(204).send();
});

const listCollaborators = asyncHandler(async (req, res) => {
  const tripId = Number(req.params.tripId);
  const result = await pool.query(tripQueries.listCollaborators, [tripId]);
  res.json({ success: true, data: result.rows });
});

module.exports = {
  listTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  listCollaborators
};
