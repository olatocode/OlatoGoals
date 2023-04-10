/** @format */

const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/:id', protect, updateProfile);


module.exports = router;

