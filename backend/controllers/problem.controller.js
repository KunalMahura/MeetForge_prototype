import Problem from '../models/Problem.js';

// GET /api/problems — list all problems
export const getAllProblems = async (req, res) => {
  try {
    const { difficulty, tag } = req.query;
    const filter = {};

    if (difficulty) filter.difficulty = difficulty;
    if (tag) filter.tags = { $in: [tag] };

    const problems = await Problem.find(filter)
      .select('title slug difficulty tags order')
      .sort({ order: 1 });

    res.json({ success: true, problems });
  } catch (err) {
    console.error('Error fetching problems:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch problems' });
  }
};

// GET /api/problems/:slug — get a single problem with full details
export const getProblemBySlug = async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });

    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }

    res.json({ success: true, problem });
  } catch (err) {
    console.error('Error fetching problem:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch problem' });
  }
};
