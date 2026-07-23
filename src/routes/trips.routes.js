const express = require('express');
const { z } = require('zod');

const controller = require('../controllers/trips.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

const bodySchema = z.object({
  body: z.object({
    destinationId: z.number().int().positive(),
    tripTitle: z.string().min(2),
    tripPurpose: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    travelerCount: z.number().int().positive(),
    tripStatus: z.string().optional()
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough()
});

const updateBodySchema = z.object({
  body: z.object({
    destinationId: z.number().int().positive().optional(),
    tripTitle: z.string().min(2).optional(),
    tripPurpose: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    travelerCount: z.number().int().positive().optional(),
    tripStatus: z.string().optional()
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough()
});

router.use(authenticate);
router.get('/', controller.listTrips);
router.get('/:tripId', controller.getTrip);
router.post('/', validate(bodySchema), controller.createTrip);
router.put('/:tripId', validate(updateBodySchema), controller.updateTrip);
router.delete('/:tripId', controller.deleteTrip);

module.exports = router;
