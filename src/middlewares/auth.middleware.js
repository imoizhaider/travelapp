const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { authQueriesExtended } = require('../db/queries');
const ApiError = require('../utils/apiError');

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Missing or invalid authorization token'));
  }

  try {
    const token = header.slice(7);
    req.user = jwt.verify(token, process.env.JWT_SECRET);

    const userResult = await pool.query(authQueriesExtended.checkUserActive, [req.user.userId]);

    if (!userResult.rows.length || !userResult.rows[0].is_active) {
      return next(new ApiError(401, 'Account is disabled or has been removed'));
    }

    return next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(401, 'Token is invalid or expired'));
  }
};

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required'));
  }

  if (!allowedRoles.length) {
    return next();
  }

  if (!allowedRoles.includes(req.user.roleName)) {
    return next(new ApiError(403, 'You do not have permission to perform this action'));
  }

  return next();
};

module.exports = {
  authenticate,
  authorize
};
