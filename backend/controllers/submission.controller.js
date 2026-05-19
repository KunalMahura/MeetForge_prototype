import prisma from '../config/prisma.js';

// POST /api/submissions — save a new submission record every time
export const saveSubmission = async (req, res) => {
  try {
    const { userId, problemId, code, language, status, output } = req.body;

    if (!userId || !problemId || !code) {
      return res.status(400).json({ success: false, error: 'userId, problemId, and code are required' });
    }

    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId,
        code,
        language: language || 'javascript',
        status: status || 'Attempted',
        output: output || '',
      },
    });

    res.status(201).json({ success: true, submission });
  } catch (err) {
    console.error('Error saving submission:', err);
    res.status(500).json({ success: false, error: 'Failed to save submission' });
  }
};

// PUT /api/submissions/upsert — one record per user+problem, don't downgrade Solved to Attempted
export const upsertSubmission = async (req, res) => {
  try {
    const { userId, problemId, code, language, status, output } = req.body;

    if (!userId || !problemId || !code) {
      return res.status(400).json({ success: false, error: 'userId, problemId, and code are required' });
    }

    // Check existing to prevent downgrading "Solved" → "Attempted"
    const existing = await prisma.submission.findFirst({
      where: { userId, problemId },
    });
    const resolvedStatus = existing?.status === 'Solved' && status !== 'Solved'
      ? 'Solved'
      : (status || 'Attempted');

    let submission;
    if (existing) {
      submission = await prisma.submission.update({
        where: { id: existing.id },
        data: {
          code,
          language: language || 'javascript',
          status: resolvedStatus,
          output: output || '',
        },
      });
    } else {
      submission = await prisma.submission.create({
        data: {
          userId,
          problemId,
          code,
          language: language || 'javascript',
          status: resolvedStatus,
          output: output || '',
        },
      });
    }

    res.status(200).json({ success: true, submission });
  } catch (err) {
    console.error('Error upserting submission:', err);
    res.status(500).json({ success: false, error: 'Failed to save submission' });
  }
};

// GET /api/submissions/latest?userId=xxx&problemId=yyy
export const getLatestSubmission = async (req, res) => {
  try {
    const { userId, problemId } = req.query;

    if (!userId || !problemId) {
      return res.status(400).json({ success: false, error: 'userId and problemId are required' });
    }

    const submission = await prisma.submission.findFirst({
      where: { userId, problemId },
      orderBy: { createdAt: 'desc' },
    });

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

    const where = { userId };
    if (problemId) where.problemId = problemId;

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        problem: {
          select: { title: true, slug: true, difficulty: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({ success: true, submissions });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch submissions' });
  }
};

// GET /api/submissions/stats?userId=xxx
export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    // Count distinct problems solved
    const solvedProblems = await prisma.submission.findMany({
      where: { userId, status: 'Solved' },
      select: { problemId: true },
      distinct: ['problemId'],
    });

    const attemptedProblems = await prisma.submission.findMany({
      where: { userId },
      select: { problemId: true },
      distinct: ['problemId'],
    });

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
