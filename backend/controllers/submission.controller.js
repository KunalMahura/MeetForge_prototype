import Submission from '../models/Submission.js';

// POST /api/submissions — save a submission (creates a new record every time)
export const saveSubmission = async (req, res) => {
  try {
    const { userId, problemId, code, language, status, output } = req.body;

    if (!userId || !problemId || !code) {
      return res.status(400).json({ success: false, error: 'userId, problemId, and code are required' });
    }

    const submission = await Submission.create({
      userId,
      problemId,
      code,
      language: language || 'javascript',
      status: status || 'Attempted',
      output: output || '',
    });

    res.status(201).json({ success: true, submission });
  } catch (err) {
    console.error('Error saving submission:', err);
    res.status(500).json({ success: false, error: 'Failed to save submission' });
  }
};

// PUT /api/submissions/upsert — upsert: update if exists, create if not (one record per user+problem)
export const upsertSubmission = async (req, res) => {
  try {
    const { userId, problemId, code, language, status, output } = req.body;

    if (!userId || !problemId || !code) {
      return res.status(400).json({ success: false, error: 'userId, problemId, and code are required' });
    }

    // If new status is 'Solved', always allow it.
    // But if we already have 'Solved', don't downgrade back to 'Attempted'.
    const existing = await Submission.findOne({ userId, problemId });
    const resolvedStatus = existing?.status === 'Solved' && status !== 'Solved'
      ? 'Solved'
      : (status || 'Attempted');

    const submission = await Submission.findOneAndUpdate(
      { userId, problemId },
      {
        $set: {
          code,
          language: language || 'javascript',
          status: resolvedStatus,
          output: output || '',
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, submission });
  } catch (err) {
    console.error('Error upserting submission:', err);
    res.status(500).json({ success: false, error: 'Failed to save submission' });
  }
};

// GET /api/submissions/latest?userId=xxx&problemId=yyy — get the latest submission for a user+problem
export const getLatestSubmission = async (req, res) => {
  try {
    const { userId, problemId } = req.query;

    if (!userId || !problemId) {
      return res.status(400).json({ success: false, error: 'userId and problemId are required' });
    }

    const submission = await Submission.findOne({ userId, problemId });
    res.json({ success: true, submission: submission || null });
  } catch (err) {
    console.error('Error fetching latest submission:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch submission' });
  }
};

// GET /api/submissions?userId=xxx — get user's submission history
export const getUserSubmissions = async (req, res) => {
  try {
    const { userId, problemId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const filter = { userId };
    if (problemId) filter.problemId = problemId;

    const submissions = await Submission.find(filter)
      .populate('problemId', 'title slug difficulty')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, submissions });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch submissions' });
  }
};

// GET /api/submissions/stats?userId=xxx — get solved/attempted counts
export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    // Get unique solved problem IDs
    const solvedProblems = await Submission.distinct('problemId', { userId, status: 'Solved' });
    const attemptedProblems = await Submission.distinct('problemId', { userId });

    res.json({
      success: true,
      stats: {
        solved: solvedProblems.length,
        attempted: attemptedProblems.length,
      },
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
};
