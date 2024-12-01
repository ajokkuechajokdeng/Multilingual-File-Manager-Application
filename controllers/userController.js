const bcrypt = require('bcrypt');
const { User } = require('../models');

// Helper function to extract data from request
const extractData = (req) => {
  // Extract from body, query, and headers
  const bodyData = req.body;
  const queryData = req.query;
  const headerData = {
    username: req.headers['x-username'],
    email: req.headers['x-email'],
    password: req.headers['x-password'],
  };

  // Choose which data source to prioritize
  return {
    username: bodyData.username || queryData.username || headerData.username,
    email: bodyData.email || queryData.email || headerData.email,
    password: bodyData.password || queryData.password || headerData.password,
  };
};

// Register a new user
exports.register = async (req, res) => {
  const { username, email, password } = extractData(req);

  if (!username || !email || !password) {
    return res.status(400).json({ message: req.t('allFieldsRequired') });
  }

  try {
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: req.t('userAlreadyExists') });
    }

    // Create a new user
    const user = await User.create({ username, email, password });
    res.status(201).json({
      message: req.t('userRegistered'),
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: req.t('errorRegisteringUser'), error });
  }
};

// Log in an existing user
exports.login = async (req, res) => {
  const { email, password } = extractData(req);

  if (!email || !password) {
    return res.status(400).json({ message: req.t('allFieldsRequired') });
  }

  try {
    // Find the user record by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: req.t('userNotFound') });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: req.t('invalidPassword') });
    }

    // Send success message upon successful login
    res.status(200).json({ message: req.t('loginSuccessful'), user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: req.t('errorLoggingIn'), error });
  }
};
