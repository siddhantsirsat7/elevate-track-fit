
const express = require('express');
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all workouts for a user
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single workout
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.json(workout);
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new workout
router.post('/', auth, async (req, res) => {
  try {
    const workout = new Workout({
      ...req.body,
      user: req.user._id
    });
    
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a workout
router.patch('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.json(workout);
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.json({ message: 'Workout deleted' });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
