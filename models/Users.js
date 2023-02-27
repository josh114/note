const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  role: [
    {
      type: String,
      default: 'Employee',
    },
  ],
});
const User = mongoose.model('User', userSchema);
module.exports = User;
