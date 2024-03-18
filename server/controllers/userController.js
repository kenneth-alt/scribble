import bcrypt from 'bcryptjs';
import generateToken from '../config/generateToken.js';

import User from '../models/userModel.js';

// Create new user
const createUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (
      !req.body.name ||
      !req.body.username ||
      !req.body.email ||
      !req.body.password
    ) {
      return res.status(400).json({ message: 'Missing required field' });
    }

    // check if username or email already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res
        .status(400)
        .json({
          message: 'Username already taken, please choose another username',
        });

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res
        .status(400)
        .json({ message: 'User with this email already exists' });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong with server' });
    console.error(error);
  }
};

/// authenticate a user // route POST /login // access Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check user email against password
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        token: generateToken(user),
        message: `Welcome ${user.username}`,
      });
    } else {
      res.status(400).json({ message: 'Invalid login credentials!' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get user by id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user by id
const updateUserById = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete user by id
const deleteUserById = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await User.findByIdAndRemove(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

export { createUser, loginUser, getUserById, updateUserById, deleteUserById };
