const express = require('express');
const { z } = require('zod');

const controller = require('../controllers/budget.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router({ mergeParams: true });

const budgetSchema = z.object({
  body: z.object({
    currencyCode: z.string().length(3),
    totalEstimated: z.number().nonnegative(),
    contingencyAmount: z.number().nonnegative()
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough()
});

const itemSchema = z.object({
  body: z.object({
    budgetCategoryId: z.number().int().positive(),
    itemDescription: z.string().min(2),
    amount: z.number().nonnegative(),
    plannedDate: z.string().optional(),
    sortOrder: z.number().int().nonnegative().optional()
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough()
});

const updateItemSchema = z.object({
  body: z.object({
    budgetCategoryId: z.number().int().positive().optional(),
    itemDescription: z.string().min(2).optional(),
    amount: z.number().nonnegative().optional(),
    plannedDate: z.string().optional(),
    sortOrder: z.number().int().nonnegative().optional()
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough()
});

router.get('/trips/:tripId/budget', authenticate, controller.getBudget);
router.put('/trips/:tripId/budget', authenticate, validate(budgetSchema), controller.saveBudget);
router.post('/trips/:tripId/budget/items', authenticate, validate(itemSchema), controller.addBudgetItem);
router.put('/budget/items/:budgetItemId', authenticate, validate(updateItemSchema), controller.updateBudgetItem);
router.delete('/budget/items/:budgetItemId', authenticate, controller.deleteBudgetItem);

module.exports = router;
