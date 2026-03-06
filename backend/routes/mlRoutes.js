const express = require('express');
const router = express.Router();
const { predictBlueprint } = require('../controllers/mlController');
const { protect } = require('../middleware/authMiddleware');

router.route('/predict').post(protect, predictBlueprint);

module.exports = router;
