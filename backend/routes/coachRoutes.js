const express = require('express');
const router = express.Router();
const {
  getCoaches,
  getCoachById,
  createCoachProfile,
  updateCoachProfile,
} = require('../controllers/coachController');
const { protect, coach } = require('../middleware/authMiddleware');

router.route('/').get(getCoaches).post(protect, coach, createCoachProfile);
router.route('/profile').put(protect, coach, updateCoachProfile);
router.route('/:id').get(getCoachById);

module.exports = router;
