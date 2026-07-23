const express = require('express');
const { z } = require('zod');

const controller = require('../controllers/sharing.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router({ mergeParams: true });

const shareLinkSchema = z.object({
  body: z.object({
    accessLevel: z.enum(['view', 'edit']),
    expiresAt: z.string().optional(),
    revokedAt: z.string().optional()
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough()
});

const collaboratorSchema = z.object({
  body: z.object({
    userId: z.number().int().positive(),
    accessLevel: z.enum(['view', 'edit']),
    status: z.enum(['pending', 'accepted', 'declined', 'revoked']).optional()
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough()
});

const collaboratorUpdateSchema = z.object({
  body: z.object({
    accessLevel: z.enum(['view', 'edit']).optional(),
    status: z.enum(['pending', 'accepted', 'declined', 'revoked']).optional()
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough()
});

router.get('/trips/:tripId/share-links', authenticate, controller.listShareLinks);
router.post('/trips/:tripId/share-links', authenticate, validate(shareLinkSchema), controller.createShareLink);
router.get('/trips/:tripId/collaborators', authenticate, controller.listCollaborators);
router.post('/trips/:tripId/collaborators', authenticate, validate(collaboratorSchema), controller.addCollaborator);
router.patch('/trips/:tripId/collaborators/:userId', authenticate, validate(collaboratorUpdateSchema), controller.updateCollaborator);

module.exports = router;
