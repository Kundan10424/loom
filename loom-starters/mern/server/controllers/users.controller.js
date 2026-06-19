const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json({ success: true, data: users });
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: user });
};

exports.createUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ success: false, error: 'name and email are required' });

  const user = await User.create({ name, email });
  res.status(201).json({ success: true, data: user });
};

exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: user });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: { message: 'User deleted' } });
};
