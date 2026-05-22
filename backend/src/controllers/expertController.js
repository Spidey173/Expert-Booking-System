import Expert from '../models/Expert.js';

// @desc    Get all experts
// @route   GET /api/experts
// @access  Public
export const getExperts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const search = req.query.search ? {
      name: {
        $regex: req.query.search,
        $options: 'i',
      },
    } : {};
    
    const category = req.query.category ? { category: req.query.category } : {};
    
    const query = { ...search, ...category };

    const count = await Expert.countDocuments(query);
    const experts = await Expert.find(query)
      .limit(limit)
      .skip(limit * (page - 1));

    res.json({
      experts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalExperts: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expert by ID
// @route   GET /api/experts/:id
// @access  Public
export const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (expert) {
      res.json(expert);
    } else {
      res.status(404);
      throw new Error('Expert not found');
    }
  } catch (error) {
    next(error);
  }
};
