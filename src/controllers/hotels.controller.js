const pool = require('../config/db');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { hotelQueries, tripQueries } = require('../db/queries');

const ensureEditableTrip = async (tripId, userId) => {
  const result = await pool.query(tripQueries.checkEditable, [tripId, userId]);

  if (!result.rows.length) {
    throw new ApiError(403, 'You do not have edit access to this trip');
  }
};

const listHotels = asyncHandler(async (req, res) => {
  const destinationId = Number(req.params.destinationId);
  const result = await pool.query(hotelQueries.listByDestination, [destinationId]);
  res.json({ success: true, data: result.rows });
});

const createHotel = asyncHandler(async (req, res) => {
  const destinationId = Number(req.params.destinationId);
  const body = req.validated.body;
  const result = await pool.query(hotelQueries.create, [
    destinationId,
    body.hotelName,
    body.hotelDescription || null,
    body.roomType,
    body.nightlyRate,
    body.currencyCode,
    body.starRating ?? null,
    body.isMock ?? true
  ]);

  res.status(201).json({ success: true, data: result.rows[0] });
});

const updateHotel = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.hotelId);
  const body = req.validated.body;
  const result = await pool.query(hotelQueries.update, [
    hotelId,
    body.hotelName || null,
    body.hotelDescription || null,
    body.roomType || null,
    body.nightlyRate ?? null,
    body.currencyCode || null,
    body.starRating ?? null,
    body.isMock ?? null
  ]);

  if (!result.rows.length) {
    throw new ApiError(404, 'Hotel not found');
  }

  res.json({ success: true, data: result.rows[0] });
});

const deleteHotel = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.hotelId);
  const result = await pool.query(hotelQueries.remove, [hotelId]);

  if (!result.rows.length) {
    throw new ApiError(404, 'Hotel not found');
  }

  res.status(204).send();
});

const createMockBooking = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.hotelId);
  const body = req.validated.body;
  await ensureEditableTrip(body.tripId, req.user.userId);

  const result = await pool.query(hotelQueries.createBooking, [
    body.tripId,
    hotelId,
    req.user.userId,
    body.checkInDate,
    body.checkOutDate,
    body.guestsCount,
    body.totalAmount,
    body.bookingStatus || 'mocked',
    body.confirmationCode || null
  ]);

  res.status(201).json({ success: true, data: result.rows[0] });
});

module.exports = {
  listHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  createMockBooking
};
