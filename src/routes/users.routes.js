const express = require('express');

const pool = require('../config/db');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { authQueries } = require('../db/queries');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/by-email/:email', authenticate, asyncHandler(async (req, res) => {
  const result = await pool.query(authQueries.findUserByEmailPublic, [req.params.email]);
  if (!result.rows.length) {
    throw new ApiError(404, 'User not found');
  }
  res.json({ success: true, data: result.rows[0] });
}));

module.exports = router;