import prisma from '../config/prisma.js';

// GET /api/problems — list all problems
export const getAllProblems = async (req, res) => {
  try {
    const { difficulty, tag } = req.query;

    const where = {};
    if (difficulty) where.difficulty = difficulty;
    if (tag) where.tags = { has: tag };

    const problems = await prisma.problem.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        tags: true,
        order: true,
      },
      orderBy: { order: 'asc' },
    });

    res.json({ success: true, problems });
  } catch (err) {
    console.error('Error fetching problems:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch problems' });
  }
};

// GET /api/problems/:slug — get a single problem with full details
export const getProblemBySlug = async (req, res) => {
  try {
    const problem = await prisma.problem.findUnique({
      where: { slug: req.params.slug },
    });

    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }

    res.json({ success: true, problem });
  } catch (err) {
    console.error('Error fetching problem:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch problem' });
  }
};
