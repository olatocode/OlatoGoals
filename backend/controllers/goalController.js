/** @format */
const asyncHandler = require('express-async-handler');
const Goal = require('../models/goalModel');
const User = require('../models/userModel');

// @desc SET Goals
// @desc GET Goals
// @desc UPDATE Goals
// @desc DELETE Goals
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error('please add a text field ');
  }
  const newGoal = await Goal.create({ text: req.body.text, user: req.user.id });
  res.status(201).json({
    mssage: 'New Goals created successfully',
    newGoal,
  });
});

const getGoal = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });
  res.status(200).json(goals);
});

const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }

  // check user
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // make sure the logged in user matches goal user
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json(updatedGoal);
});

const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }

  // check user
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // make sure the logged in user matches goal user
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const deleted = await Goal.deleteOne(req.params._id);

  res.status(200).json({ msg: 'Goal deleted', deleted });
});

module.exports = { setGoal, getGoal, updateGoal, deleteGoal };
