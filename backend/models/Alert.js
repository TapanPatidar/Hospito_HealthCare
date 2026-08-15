/**
 * Pharmacy Alert Model (Mongoose)
 * Path: backend/models/Alert.js
 */
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    pharmacyId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['new_rx', 'status_update', 'info'],
      default: 'new_rx',
    },
    prescriptionId: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
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
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Alert', alertSchema);
