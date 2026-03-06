const express = require('express');
const router = express.Router();
const {
  getCoaches,
  getCoachById,
  createCoachProfile,
  updateCoachProfile,
  adminUpdateCoachProfile,
  getMyCoachProfile,
} = require('../controllers/coachController');
const { protect, admin, coach } = require('../middleware/authMiddleware');

router.route('/').get(getCoaches).post(protect, coach, createCoachProfile);
router.route('/myprofile').get(protect, coach, getMyCoachProfile);
router.route('/profile').put(protect, coach, updateCoachProfile);
router.route('/admin/:id').put(protect, admin, adminUpdateCoachProfile);
router.route('/:id').get(getCoachById);

module.exports = router;
