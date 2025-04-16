
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sets: {
    type: Number
  },
  reps: {
    type: Number
  },
  weight: {
    type: Number
  },
  duration: {
    type: Number
  },
  distance: {
    type: Number
  }
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'sports', 'other'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true
  },
  caloriesBurned: {
    type: Number
  },
  notes: {
    type: String,
    trim: true
  },
  exercises: [exerciseSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
