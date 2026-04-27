import express from 'express';
import {
  createInterview,
  getUserInterviews,
  joinInterview,
  getStreamToken
} from '../controllers/interview.controller.js';

const router = express.Router();

// Get Stream Token
router.get('/token', getStreamToken);

// CRUD operations
router.post('/', createInterview);
router.get('/', getUserInterviews);

// Join specific room
router.post('/:roomId/join', joinInterview);

export default router;
