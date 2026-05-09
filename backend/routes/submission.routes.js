import express from 'express';
import { saveSubmission, getUserSubmissions, getUserStats, upsertSubmission, getLatestSubmission } from '../controllers/submission.controller.js';

const router = express.Router();

router.post('/', saveSubmission);
router.put('/upsert', upsertSubmission);
router.get('/latest', getLatestSubmission);
router.get('/stats', getUserStats);
router.get('/', getUserSubmissions);

export default router;
