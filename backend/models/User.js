/**
 * User Model (Mongoose)
 * Path: backend/models/User.js
 */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      required: true,
      enum: ['patient', 'doctor', 'pharmacist'],
      default: 'patient',
    },
    // Patient specific fields
    dateOfBirth: {
      type: String,
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
      default: '',
    },
    medicalHistory: [{
      type: String,
    }],
    allergies: [{
      type: String,
    }],
    // Doctor specific fields
    specialization: {
      type: String,
      default: '',
    },
    licenseNumber: {
      type: String,
      default: '',
    },
    // Pharmacist specific fields
    pharmacyName: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('User', userSchema);
