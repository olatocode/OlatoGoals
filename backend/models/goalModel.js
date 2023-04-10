/** @format */

const mongoose = require('mongoose');

const goalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: {
      type: String,
      required: [true, 'pleas add text value'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);
