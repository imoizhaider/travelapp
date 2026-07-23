const { randomUUID } = require('crypto');

const pool = require('../config/db');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { sharingQueries, tripQueries } = require('../db/queries');

const ensureEditableTrip = async (tripId, userId) => {
  const result = await pool.query(tripQueries.checkEditable, [tripId, userId]);

  if (!result.rows.length) {
    throw new ApiError(403, 'You do not have edit access to this trip');
  }
};

const createShareLink = asyncHandler(async (req, res) => {
  const tripId = Number(req.params.tripId);
  await ensureEditableTrip(tripId, req.user.userId);

  const body = req.validated.body;
  const result = await pool.query(sharingQueries.createShareLink, [
    tripId,
    req.user.userId,
    randomUUID(),
    body.accessLevel,
    body.expiresAt || null,
    body.revokedAt || null
  ]);

  res.status(201).json({ success: true, data: result.rows[0] });
});

const listShareLinks = asyncHandler(async (req, res) => {
  const tripId = Number(req.params.tripId);
  const result = await pool.query(sharingQueries.listShareLinks, [tripId]);
  res.json({ success: true, data: result.rows });
});

const listCollaborators = asyncHandler(async (req, res) => {
  const tripId = Number(req.params.tripId);
  const result = await pool.query(sharingQueries.listCollaborators, [tripId]);
  res.json({ success: true, data: result.rows });
});

const addCollaborator = asyncHandler(async (req, res) => {
  const tripId = Number(req.params.tripId);
  await ensureEditableTrip(tripId, req.user.userId);

  const body = req.validated.body;
  const result = await pool.query(sharingQueries.createCollaborator, [
    tripId,
    body.userId,
    req.user.userId,
    body.accessLevel,
    body.status || 'pending'
  ]);

  res.status(201).json({ success: true, data: result.rows[0] });
});

const updateCollaborator = asyncHandler(async (req, res) => {
  const tripId = Number(req.params.tripId);
  const collaboratorUserId = Number(req.params.userId);
  await ensureEditableTrip(tripId, req.user.userId);

  const body = req.validated.body;
  const result = await pool.query(sharingQueries.updateCollaborator, [
    tripId,
    collaboratorUserId,
    body.accessLevel || null,
    body.status || null
  ]);

  if (!result.rows.length) {
    throw new ApiError(404, 'Collaborator not found');
  }

  res.json({ success: true, data: result.rows[0] });
});

module.exports = {
  createShareLink,
  listShareLinks,
  listCollaborators,
  addCollaborator,
  updateCollaborator
};
