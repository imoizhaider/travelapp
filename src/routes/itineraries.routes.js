const express = require('express');
const { z } = require('zod');

const controller = require('../controllers/itineraries.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router({ mergeParams: true });

const createSchema = z.object({
  body: z.object({
    categoryId: z.number().int().positive(),
    destinationId: z.number().int().positive().optional(),
    itemDate: z.string(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    itemTitle: z.string().min(2),
    locationName: z.string().optional(),
    notes: z.string().optional(),
    estimatedCost: z.number().nonnegative().optional(),
    isCompleted: z.boolean().optional(),
    sortOrder: z.number().int().nonnegative().optional()
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough()
});

const updateSchema = z.object({
  body: z.object({
    categoryId: z.number().int().positive().optional(),
    destinationId: z.number().int().positive().optional(),
    itemDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    itemTitle: z.string().min(2).optional(),
    locationName: z.string().optional(),
    notes: z.string().optional(),
    estimatedCost: z.number().nonnegative().optional(),
    isCompleted: z.boolean().optional(),
    sortOrder: z.number().int().nonnegative().optional()
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough()
});

router.get('/trips/:tripId/itinerary', authenticate, controller.listByTrip);
router.post('/trips/:tripId/itinerary', authenticate, validate(createSchema), controller.createItem);
router.put('/itineraries/:itineraryItemId', authenticate, validate(updateSchema), controller.updateItem);
router.delete('/itineraries/:itineraryItemId', authenticate, controller.deleteItem);

module.exports = router;
