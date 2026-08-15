/**
 * Authentication Controller
 * Path: backend/controllers/authController.js
 */
const crypto = require('crypto');
const User = require('../models/User');

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password + '_hospito_salt_2026').digest('hex');
};

// @desc    Register a new user (Patient, Doctor, or Pharmacist)
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { email, password, name, role, dateOfBirth, bloodType, specialization, licenseNumber, pharmacyName } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Please provide email, password, name, and role' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      dateOfBirth: role === 'patient' ? dateOfBirth : undefined,
      bloodType: role === 'patient' ? bloodType : undefined,
      specialization: role === 'doctor' ? specialization : undefined,
      licenseNumber: (role === 'doctor' || role === 'pharmacist') ? licenseNumber : undefined,
      pharmacyName: role === 'pharmacist' ? pharmacyName : undefined,
      medicalHistory: role === 'patient' ? [] : undefined,
      allergies: role === 'patient' ? [] : undefined,
    });

    res.status(201).json({
      user,
      token: `hospito_jwt_${user._id}_${Date.now()}`,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during user registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const inputHash = hashPassword(password);
    if (user.passwordHash !== inputHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      user,
      token: `hospito_jwt_${user._id}_${Date.now()}`,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing user ID header' });
    }

    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
