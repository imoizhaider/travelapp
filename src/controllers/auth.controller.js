const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../config/db');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { authQueries } = require('../db/queries');

const signToken = (user) => jwt.sign(user, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});

const buildUserResponse = (row) => ({
  userId: row.user_id,
  roleName: row.role_name,
  email: row.email,
  isActive: row.is_active,
  profile: {
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    timezone: row.timezone
  }
});

const register = asyncHandler(async (req, res) => {
  const { email, password, fullName, avatarUrl, bio, timezone, roleName = 'Registered Traveler' } = req.validated.body;
  const existing = await pool.query(authQueries.findUserByEmail, [email]);

  if (existing.rows.length) {
    throw new ApiError(409, 'Email is already registered');
  }

  const roleResult = await pool.query(authQueries.getRoleByName, [roleName]);

  if (!roleResult.rows.length) {
    throw new ApiError(400, 'Default role not found. Seed the roles table first.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const userResult = await pool.query(authQueries.createUser, [roleResult.rows[0].role_id, email, passwordHash]);
  const profileResult = await pool.query(authQueries.createProfile, [
    userResult.rows[0].user_id,
    fullName,
    avatarUrl || null,
    bio || null,
    timezone || null
  ]);

  const token = signToken({
    userId: userResult.rows[0].user_id,
    roleName,
    email
  });

  res.status(201).json({
    success: true,
    token,
    user: buildUserResponse({
      user_id: userResult.rows[0].user_id,
      role_name: roleName,
      email: userResult.rows[0].email,
      is_active: userResult.rows[0].is_active,
      full_name: profileResult.rows[0].full_name,
      avatar_url: profileResult.rows[0].avatar_url,
      bio: profileResult.rows[0].bio,
      timezone: profileResult.rows[0].timezone
    })
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const result = await pool.query(authQueries.findUserByEmail, [email]);

  if (!result.rows.length) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const user = result.rows[0];
  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = signToken({
    userId: user.user_id,
    roleName: user.role_name,
    email: user.email
  });

  res.json({
    success: true,
    token,
    user: buildUserResponse(user)
  });
});

const me = asyncHandler(async (req, res) => {
  const result = await pool.query(authQueries.getUserById, [req.user.userId]);

  if (!result.rows.length) {
    throw new ApiError(404, 'User profile not found');
  }

  res.json({ success: true, user: buildUserResponse(result.rows[0]) });
});

module.exports = {
  register,
  login,
  me
};
