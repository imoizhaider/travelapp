const pool = require('../config/db');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { itineraryQueries, tripQueries } = require('../db/queries');

const ensureEditableTrip = async (tripId, userId) => {
  const result = await pool.query(tripQueries.checkEditable, [tripId, userId]);

  if (!result.rows.length) {
    throw new ApiError(403, 'You do not have edit access to this trip');
  }
};

const listByTrip = asyncHandler(async (req, res) => {
  const tripId = Number(req.params.tripId);
  const result = await pool.query(itineraryQueries.listByTrip, [tripId]);
  res.json({ success: true, data: result.rows });
});

const createItem = asyncHandler(async (req, res) => {
  const tripId = Number(req.params.tripId);
  await ensureEditableTrip(tripId, req.user.userId);

  const body = req.validated.body;
  const result = await pool.query(itineraryQueries.create, [
    tripId,
    body.categoryId,
    body.destinationId || null,
    body.itemDate,
    body.startTime || null,
    body.endTime || null,
    body.itemTitle,
    body.locationName || null,
    body.notes || null,
    body.estimatedCost ?? null,
    body.isCompleted ?? false,
    body.sortOrder ?? 1
  ]);

  res.status(201).json({ success: true, data: result.rows[0] });
});

const updateItem = asyncHandler(async (req, res) => {
  const itineraryItemId = Number(req.params.itineraryItemId);
  const itemResult = await pool.query(itineraryQueries.getTripByItemId, [itineraryItemId]);

  if (!itemResult.rows.length) {
    throw new ApiError(404, 'Itinerary item not found');
  }

  await ensureEditableTrip(itemResult.rows[0].trip_id, req.user.userId);

  const body = req.validated.body;
  const result = await pool.query(itineraryQueries.update, [
    itineraryItemId,
    body.categoryId ?? null,
    body.destinationId ?? null,
    body.itemDate || null,
    body.startTime || null,
    body.endTime || null,
    body.itemTitle || null,
    body.locationName || null,
    body.notes || null,
    body.estimatedCost ?? null,
    body.isCompleted ?? null,
    body.sortOrder ?? null
  ]);

  if (!result.rows.length) {
    throw new ApiError(404, 'Itinerary item not found');
  }

  res.json({ success: true, data: result.rows[0] });
});

const deleteItem = asyncHandler(async (req, res) => {
  const itineraryItemId = Number(req.params.itineraryItemId);
  const itemResult = await pool.query(itineraryQueries.getTripByItemId, [itineraryItemId]);

  if (!itemResult.rows.length) {
    throw new ApiError(404, 'Itinerary item not found');
  }

  await ensureEditableTrip(itemResult.rows[0].trip_id, req.user.userId);

  const result = await pool.query(itineraryQueries.remove, [itineraryItemId]);

  if (!result.rows.length) {
    throw new ApiError(404, 'Itinerary item not found');
  }

  res.status(204).send();
});

module.exports = {
  listByTrip,
  createItem,
  updateItem,
  deleteItem
};
