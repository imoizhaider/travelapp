const express = require('express');
const { z } = require('zod');

const controller = require('../controllers/hotels.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router({ mergeParams: true });

const hotelSchema = z.object({
  body: z.object({
    hotelName: z.string().min(2),
    hotelDescription: z.string().optional(),
    roomType: z.string().min(2),
    nightlyRate: z.number().nonnegative(),
    currencyCode: z.string().length(3),
    starRating: z.number().min(1).max(5).optional(),
    isMock: z.boolean().optional()
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough()
});

const bookingSchema = z.object({
  body: z.object({
    tripId: z.number().int().positive(),
    checkInDate: z.string(),
    checkOutDate: z.string(),
    guestsCount: z.number().int().positive(),
    totalAmount: z.number().nonnegative(),
    bookingStatus: z.string().optional(),
    confirmationCode: z.string().optional()
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough()
});

router.get('/destinations/:destinationId/hotels', controller.listHotels);
router.post('/destinations/:destinationId/hotels', authenticate, authorize('Administrator'), validate(hotelSchema), controller.createHotel);
router.put('/hotels/:hotelId', authenticate, authorize('Administrator'), validate(hotelSchema), controller.updateHotel);
router.delete('/hotels/:hotelId', authenticate, authorize('Administrator'), controller.deleteHotel);
router.post('/hotels/:hotelId/mock-bookings', authenticate, validate(bookingSchema), controller.createMockBooking);

module.exports = router;
