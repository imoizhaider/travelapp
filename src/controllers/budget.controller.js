const pool = require('../config/db');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { budgetQueries, tripQueries } = require('../db/queries');

const ensureEditableTrip = async (tripId, userId) => {
  const result = await pool.query(tripQueries.checkEditable, [tripId, userId]);

  if (!result.rows.length) {
    throw new ApiError(403, 'You do not have edit access to this trip');
  }
};

const ensureAccessibleTrip = async (tripId, userId) => {
  const result = await pool.query(tripQueries.checkAccessible, [tripId, userId]);

  if (!result.rows.length) {
    throw new ApiError(403, 'You do not have access to this trip');
  }
};

const getBudget = asyncHandler(async (req, res) => {
  const tripId = Number(req.params.tripId);
  await ensureAccessibleTrip(tripId, req.user.userId);

  const estimateResult = await pool.query(budgetQueries.getEstimateByTrip, [tripId]);

  if (!estimateResult.rows.length) {
    return res.json({ success: true, data: null });
  }

  const itemsResult = await pool.query(budgetQueries.listItems, [estimateResult.rows[0].budget_estimate_id]);
  res.json({
    success: true,
    data: {
      estimate: estimateResult.rows[0],
      items: itemsResult.rows
    }
  });
});

const saveBudget = asyncHandler(async (req, res) => {
  const tripId = Number(req.params.tripId);
  await ensureEditableTrip(tripId, req.user.userId);

  const body = req.validated.body;
  const result = await pool.query(budgetQueries.upsertEstimate, [
    tripId,
    body.currencyCode,
    body.totalEstimated,
    body.contingencyAmount
  ]);

  res.json({ success: true, data: result.rows[0] });
});

const addBudgetItem = asyncHandler(async (req, res) => {
  const tripId = Number(req.params.tripId);
  await ensureEditableTrip(tripId, req.user.userId);

  const estimateResult = await pool.query(budgetQueries.getEstimateByTrip, [tripId]);

  if (!estimateResult.rows.length) {
    throw new ApiError(404, 'Create the budget estimate before adding items');
  }

  const body = req.validated.body;
  const result = await pool.query(budgetQueries.createItem, [
    estimateResult.rows[0].budget_estimate_id,
    body.budgetCategoryId,
    body.itemDescription,
    body.amount,
    body.plannedDate || null,
    body.sortOrder ?? 1
  ]);

  res.status(201).json({ success: true, data: result.rows[0] });
});

const updateBudgetItem = asyncHandler(async (req, res) => {
  const budgetItemId = Number(req.params.budgetItemId);
  const itemResult = await pool.query(budgetQueries.getTripByItemId, [budgetItemId]);

  if (!itemResult.rows.length) {
    throw new ApiError(404, 'Budget item not found');
  }

  await ensureEditableTrip(itemResult.rows[0].trip_id, req.user.userId);

  const body = req.validated.body;
  const result = await pool.query(budgetQueries.updateItem, [
    budgetItemId,
    body.budgetCategoryId ?? null,
    body.itemDescription || null,
    body.amount ?? null,
    body.plannedDate || null,
    body.sortOrder ?? null
  ]);

  if (!result.rows.length) {
    throw new ApiError(404, 'Budget item not found');
  }

  res.json({ success: true, data: result.rows[0] });
});

const deleteBudgetItem = asyncHandler(async (req, res) => {
  const budgetItemId = Number(req.params.budgetItemId);
  const itemResult = await pool.query(budgetQueries.getTripByItemId, [budgetItemId]);

  if (!itemResult.rows.length) {
    throw new ApiError(404, 'Budget item not found');
  }

  await ensureEditableTrip(itemResult.rows[0].trip_id, req.user.userId);

  const result = await pool.query(budgetQueries.removeItem, [budgetItemId]);

  if (!result.rows.length) {
    throw new ApiError(404, 'Budget item not found');
  }

  res.status(204).send();
});

module.exports = {
  getBudget,
  saveBudget,
  addBudgetItem,
  updateBudgetItem,
  deleteBudgetItem
};
