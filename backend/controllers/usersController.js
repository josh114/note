const User = require('../models/Users');
const Note = require('../models/Notes');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean();
  if (!users.length) {
    return res.status(400).json({ message: 'No Users found' });
  }
  res.json(users);
});
const createUsers = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  //check for valid detils
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  //check for duplicates
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate Username' });
  }
  //hash password
  const hashedPwd = await bcrypt.hash(password, 10); //salt rounds

  const userObj = { username, password: hashedPwd, roles };
  const user = await User.create(userObj);
  if (user) {
    res.status(201).json({ message: `New User ${username} created` });
  } else {
    res.status(400).json({ message: 'Invlid  user data received' });
  }
});
const updateUsers = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== Boolean
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const user = await User.findById({ id }).exec();
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  //check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  //allow updates to original
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' });
  }
  user.username = username;
  user.active = active;
  user.roles = roles;
  if (password) {
    const updatedPwd = await bcrypt.hash(password, 10);
    user.password = updatedPwd;
  }
  const updatedUser = await user.save();
  res.status(201).json({ message: `${updatedUser.username} updated` });
});
const deleteUsers = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'ID required' });
  }
  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: 'User is assigned notes' });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: 'user not found' });
  }
  const result = await user.deleteOne();
  const reply = `Username ${result.username} with ID ${result._id} deleted`;
  res.json(reply);
});

module.exports = { getAllUsers, createUsers, updateUsers, deleteUsers };
