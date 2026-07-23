const express = require('express');
const { z } = require('zod');

const controller = require('../controllers/destinations.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

const bodySchema = z.object({
  body: z.object({
    destinationName: z.string().min(2).optional(),
    city: z.string().min(2).optional(),
    region: z.string().optional(),
    country: z.string().min(2).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    summary: z.string().optional(),
    averageCostLevel: z.string().optional(),
    popularityScore: z.number().int().min(1).max(100).optional()
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough()
});

router.get('/', controller.listDestinations);
router.get('/:destinationId', controller.getDestination);
router.post('/', authenticate, authorize('Administrator'), validate(bodySchema), controller.createDestination);
router.put('/:destinationId', authenticate, authorize('Administrator'), validate(bodySchema), controller.updateDestination);
router.delete('/:destinationId', authenticate, authorize('Administrator'), controller.deleteDestination);

module.exports = router;
