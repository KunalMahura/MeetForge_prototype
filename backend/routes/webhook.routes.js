import express from 'express';
import { clerkWebhook } from '../controllers/webhook.controller.js';

const router = express.Router();

// Clerk webhook requires raw body parsing for Svix signature verification
router.post(
  '/clerk',
  express.raw({ type: 'application/json' }),
  clerkWebhook
);

export default router;
