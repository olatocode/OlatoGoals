/** @format */

const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // check input validation
  if (!firstname || !lastname || !email || !password) {
    res.status(400);
    throw new Error('Please provide all fields');
  }

  // check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create new user
  const user = await User.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && bcrypt.compare(password, user.password)) {
    res.status(200).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('invalid credentials');
  }
});

// @desc Get user data
// @route Get api/users/me
// @access Private

const getMe = asyncHandler(async (req, res) => {
  const { _id, firstname, lastname, email } = await User.findById(req.user.id);
  res.status(200).json({
    _id,
    firstname,
    lastname,
    email,
  });
});

// Update Profile
const updateProfile = asyncHandler(async (req, res) => {
  // check user
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // make sure the logged in user matches goal user
  if (req.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }
  const userUpdated = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json(userUpdated);
});

// generate jwt
let generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = { register, login, getMe, updateProfile };
