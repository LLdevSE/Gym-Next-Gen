const mongoose = require('mongoose');

const coachProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    specialization: {
      type: String,
      required: true, // e.g., 'Strength', 'Yoga', 'HIIT', 'Cardio'
    },
    bio: {
      type: String,
      required: true,
    },
    availableSessions: [
      {
        type: String,
        enum: ['Morning', 'Evening', 'Night'],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CoachProfile = mongoose.model('CoachProfile', coachProfileSchema);

module.exports = CoachProfile;
