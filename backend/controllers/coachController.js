const CoachProfile = require('../models/CoachProfile');

// @desc    Get all coach profiles
// @route   GET /api/coaches
// @access  Public
const getCoaches = async (req, res) => {
  const coaches = await CoachProfile.find({}).populate('user', 'name email profileImage role');
  res.json(coaches);
};

// @desc    Get coach profile by ID
// @route   GET /api/coaches/:id
// @access  Public
const getCoachById = async (req, res) => {
  const coach = await CoachProfile.findById(req.params.id).populate('user', 'name email profileImage');

  if (coach) {
    res.json(coach);
  } else {
    res.status(404).json({ message: 'Coach profile not found' });
  }
};

// @desc    Create a coach profile
// @route   POST /api/coaches
// @access  Private/Coach
const createCoachProfile = async (req, res) => {
  const { specialization, bio, availableSessions } = req.body;

  const profileExists = await CoachProfile.findOne({ user: req.user._id });

  if (profileExists) {
    return res.status(400).json({ message: 'Coach profile already exists' });
  }

  const coach = new CoachProfile({
    user: req.user._id,
    specialization,
    bio,
    availableSessions,
  });

  const createdCoach = await coach.save();
  res.status(201).json(createdCoach);
};

// @desc    Update a coach profile
// @route   PUT /api/coaches/profile
// @access  Private/Coach
const updateCoachProfile = async (req, res) => {
  const { specialization, bio, availableSessions } = req.body;

  const coach = await CoachProfile.findOne({ user: req.user._id });

  if (coach) {
    coach.specialization = specialization || coach.specialization;
    coach.bio = bio || coach.bio;
    coach.availableSessions = availableSessions || coach.availableSessions;

    const updatedCoach = await coach.save();
    res.json(updatedCoach);
  } else {
    res.status(404).json({ message: 'Coach profile not found' });
  }
};

module.exports = { getCoaches, getCoachById, createCoachProfile, updateCoachProfile };
