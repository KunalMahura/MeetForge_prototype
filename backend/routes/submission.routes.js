import express from 'express';
import { saveSubmission, getUserSubmissions, getUserStats } from '../controllers/submission.controller.js';

const router = express.Router();

router.post('/', saveSubmission);
router.get('/', getUserSubmissions);
router.get('/stats', getUserStats);

export default router;
