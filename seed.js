import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User, Subscription, connectDB } from './server/models.js';

dotenv.config();

export async function runSeed(force = false) {
  console.log('🌱 Starting MongoDB Atlas Seeding Process...');

  const dbStatus = await connectDB();
  if (!dbStatus.isConnected) {
    throw new Error(`Cannot seed database: ${dbStatus.error || 'Failed to connect to MongoDB Atlas'}`);
  }

  const existingUsersCount = await User.countDocuments();
  console.log(`📊 Current Atlas database state: ${existingUsersCount} user(s) found in "${mongoose.connection.name}".`);

  if (existingUsersCount > 0 && !force) {
    console.log('ℹ️ Idempotency check: Data already exists in MongoDB Atlas collections.');
    console.log('⏩ Skipping insert to avoid duplicate records. Pass --force to re-seed.');
    
    const users = await User.find({}, '-passwordHash').limit(5);
    const subscriptions = await Subscription.find().populate('userId', 'name email');

    return {
      success: true,
      skipped: true,
      message: 'Seed data already present in Atlas collections',
      database: mongoose.connection.name,
      usersCount: existingUsersCount,
      subscriptionsCount: subscriptions.length,
      sampleUsers: users,
    };
  }

  // If force is requested, clean up existing starter records
  if (force && existingUsersCount > 0) {
    console.log('🧹 Clearing existing collections for clean re-seed...');
    await Subscription.deleteMany({});
    await User.deleteMany({});
  }

  // 1. Prepare sample user profiles
  const sampleUsersRaw = [
    {
      name: 'Sarah Connor',
      email: 'sarah.connor@cyberdyne.io',
      password: 'Password123!',
      plan: 'enterprise',
    },
    {
      name: 'Alex Vance',
      email: 'alex.vance@blackmesa.org',
      password: 'Password123!',
      plan: 'professional',
    },
    {
      name: 'John Doe',
      email: 'john.doe@techcorp.com',
      password: 'Password123!',
      plan: 'starter',
    },
    {
      name: 'Elena Rostova',
      email: 'elena.rostova@novasolutions.dev',
      password: 'Password123!',
      plan: 'professional',
    },
    {
      name: 'Marcus Chen',
      email: 'marcus.chen@nexuscloud.app',
      password: 'Password123!',
      plan: 'starter',
    },
  ];

  console.log(`🔐 Hashing passwords and creating ${sampleUsersRaw.length} starter user documents...`);

  const createdUsers = [];
  for (const item of sampleUsersRaw) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(item.password, salt);

    const userDoc = await User.create({
      name: item.name,
      email: item.email,
      passwordHash,
      plan: item.plan,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000), // Created within the last 30 days
    });

    createdUsers.push(userDoc);
  }

  console.log(`✅ Inserted ${createdUsers.length} users into Atlas "users" collection.`);

  // 2. Prepare and link sample subscriptions
  const planDetails = {
    starter: { name: 'Starter', amount: 29 },
    professional: { name: 'Professional', amount: 79 },
    enterprise: { name: 'Enterprise', amount: 249 },
  };

  const sampleSubscriptions = [];
  for (let i = 0; i < createdUsers.length; i++) {
    const user = createdUsers[i];
    const planInfo = planDetails[user.plan] || planDetails.starter;
    const isTrial = i === 4; // 1 trialing user
    const isCanceled = i === 3; // 1 canceled user

    const now = new Date();
    const renewalDate = new Date(now);
    renewalDate.setMonth(renewalDate.getMonth() + 1);

    const subDoc = await Subscription.create({
      userId: user._id,
      planName: planInfo.name,
      status: isTrial ? 'trialing' : isCanceled ? 'canceled' : 'active',
      startDate: new Date(Date.now() - 14 * 86400000),
      renewalDate: renewalDate,
      amount: planInfo.amount,
    });

    sampleSubscriptions.push(subDoc);
  }

  console.log(`✅ Inserted ${sampleSubscriptions.length} subscriptions into Atlas "subscriptions" collection.`);

  const summary = {
    success: true,
    skipped: false,
    database: mongoose.connection.name,
    clusterHost: mongoose.connection.host,
    usersInserted: createdUsers.length,
    subscriptionsInserted: sampleSubscriptions.length,
    collections: ['users', 'subscriptions'],
    users: createdUsers.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      plan: u.plan,
      createdAt: u.createdAt,
    })),
  };

  console.log('\n=========================================');
  console.log('🎉 SEEDING COMPLETE - ATLAS SUMMARY');
  console.log('=========================================');
  console.log(`Database Name : ${summary.database}`);
  console.log(`Cluster Host  : ${summary.clusterHost}`);
  console.log(`Users Added   : ${summary.usersInserted} documents -> "users" collection`);
  console.log(`Subs Added    : ${summary.subscriptionsInserted} documents -> "subscriptions" collection`);
  console.log('=========================================\n');

  return summary;
}

// Allow direct CLI execution: node seed.js or npm run seed
const isDirectExecution = process.argv[1] && process.argv[1].endsWith('seed.js');
if (isDirectExecution) {
  const force = process.argv.includes('--force');
  runSeed(force)
    .then(() => {
      console.log('👋 Seed script finished cleanly. Disconnecting from Atlas...');
      mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error('💥 Seeding failed:', err);
      mongoose.disconnect();
      process.exit(1);
    });
}
