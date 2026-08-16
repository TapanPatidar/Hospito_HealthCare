import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Mongoose Connection Management
let isConnected = false;
let dbName = 'saas_db';
let clusterHost = 'Atlas Cluster';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not defined in environment variables. Database operations will wait for connection.');
    return { isConnected: false, error: 'MONGODB_URI environment variable missing' };
  }

  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return { isConnected: true, dbName: mongoose.connection.name, host: mongoose.connection.host };
  }

  try {
    // Enable strict query
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    dbName = conn.connection.name || 'saas_db';
    clusterHost = conn.connection.host || 'MongoDB Atlas';

    console.log(`✅ MongoDB Atlas connected successfully to host: ${clusterHost} | Database: "${dbName}"`);
    return { isConnected: true, dbName, host: clusterHost };
  } catch (error) {
    isConnected = false;
    console.error(`❌ MongoDB Atlas connection error: ${error.message}`);
    return { isConnected: false, error: error.message };
  }
}

// ----------------------------------------------------
// SCHEMAS & MODELS
// ----------------------------------------------------

// 1. User Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    plan: {
      type: String,
      enum: {
        values: ['starter', 'professional', 'enterprise', 'free'],
        message: '{VALUE} is not a supported plan',
      },
      default: 'starter',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// 2. Subscription Schema
const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference (userId) is required'],
      index: true,
    },
    planName: {
      type: String,
      required: [true, 'Plan name is required'],
      enum: {
        values: ['Starter', 'Professional', 'Enterprise', 'Custom'],
        message: '{VALUE} is not a valid plan name',
      },
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['active', 'trialing', 'canceled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    renewalDate: {
      type: Date,
      required: [true, 'Renewal date is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be greater than or equal to 0'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Prevent recompiling models in HMR / restart
export const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');
export const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema, 'subscriptions');

// Helper to hash password
export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

// Helper to compare password
export async function verifyPassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

// Database inspection and status helper
export async function getDBDiagnostics() {
  const state = mongoose.connection.readyState;
  const stateLabels = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const statusLabel = stateLabels[state] || 'unknown';

  let userCount = 0;
  let subscriptionCount = 0;
  let error = null;

  if (state === 1) {
    try {
      userCount = await User.countDocuments();
      subscriptionCount = await Subscription.countDocuments();
    } catch (e) {
      error = e.message;
    }
  }

  return {
    connected: state === 1,
    status: statusLabel,
    readyState: state,
    databaseName: mongoose.connection.name || 'Not Connected',
    host: mongoose.connection.host || 'None',
    collections: {
      users: { count: userCount, collectionName: 'users' },
      subscriptions: { count: subscriptionCount, collectionName: 'subscriptions' },
    },
    hasUriConfigured: Boolean(process.env.MONGODB_URI),
    error,
  };
}
