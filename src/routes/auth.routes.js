const express = require('express');
const { z } = require('zod');

const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    fullName: z.string().min(2),
    avatarUrl: z.string().url().optional(),
    bio: z.string().optional(),
    timezone: z.string().optional(),
    roleName: z.string().optional()
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough()
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough()
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.me);

module.exports = router;
