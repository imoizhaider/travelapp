const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Missing or invalid authorization token'));
  }

  try {
    const token = header.slice(7);
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
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
