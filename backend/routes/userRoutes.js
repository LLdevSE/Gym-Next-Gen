const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
  updateUserStatus,
  deleteUser,
  adminCreateUser,
  adminUpdateUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getUsers);
router.route('/admin-create').post(protect, admin, adminCreateUser);
router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/:id/status').put(protect, admin, updateUserStatus);
router.route('/:id').put(protect, admin, adminUpdateUser).delete(protect, admin, deleteUser);

module.exports = router;
