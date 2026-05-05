import Submission from '../models/Submission.js';

// POST /api/submissions — save a submission
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
