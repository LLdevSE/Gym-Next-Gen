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

// @desc    Admin Update any coach profile by ID
// @route   PUT /api/coaches/admin/:id
// @access  Private/Admin
const adminUpdateCoachProfile = async (req, res, next) => {
  try {
    const { specialization, bio, availableSessions } = req.body;
    const coach = await CoachProfile.findById(req.params.id);

    if (coach) {
      coach.specialization = specialization || coach.specialization;
      coach.bio = bio || coach.bio;
      coach.availableSessions = availableSessions || coach.availableSessions;
      const updatedCoach = await coach.save();
      res.json(updatedCoach);
    } else {
      res.status(404).json({ message: 'Coach profile not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in coach's own profile
// @route   GET /api/coaches/myprofile
// @access  Private/Coach
const getMyCoachProfile = async (req, res, next) => {
  try {
    const profile = await CoachProfile.findOne({ user: req.user._id }).populate('user', 'name email profileImage');
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Coach profile not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getCoaches, getCoachById, createCoachProfile, updateCoachProfile, adminUpdateCoachProfile, getMyCoachProfile };
