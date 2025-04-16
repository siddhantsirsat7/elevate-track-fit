
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['weight', 'workout', 'distance', 'strength', 'custom'],
    required: true
  },
  target: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
