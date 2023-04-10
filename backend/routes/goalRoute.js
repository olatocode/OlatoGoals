/** @format */

const express = require('express');
const {
  setGoal,
  getGoal,
  updateGoal,
  deleteGoal,
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, setGoal).get('/', protect, getGoal);
router.put('/:id', protect, updateGoal).delete('/:id', protect, deleteGoal);

module.exports = router;
