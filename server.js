import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer as createViteServer } from 'vite';
import { User, Subscription, connectDB, hashPassword, getDBDiagnostics } from './server/models.js';
import { runSeed } from './seed.js';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB Atlas
  console.log('🔄 Initializing MongoDB Atlas connection...');
  await connectDB();

  // Auto-connect middleware for API routes
  app.use('/api', async (req, res, next) => {
    if (mongoose.connection.readyState !== 1 && process.env.MONGODB_URI) {
      await connectDB();
    }
    next();
  });

  // ----------------------------------------------------
  // API ROUTES
  // ----------------------------------------------------

  // 1. Health & Database Status Diagnostics
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'SaaS Platform API',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/db-status', async (req, res) => {
    try {
      const diagnostics = await getDBDiagnostics();
      res.json(diagnostics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // 2. POST /api/signup - Persists new user to Atlas 'users' collection
  app.post('/api/signup', async (req, res) => {
    try {
      const { name, email, password, plan = 'starter' } = req.body;

      // Basic input validation
      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: 'Name is required (minimum 2 characters)' });
      }

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: 'A valid email address is required' });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Check if user already exists
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(409).json({ error: `User with email ${normalizedEmail} already exists in Atlas` });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Insert User document into Atlas
      const newUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        plan: ['starter', 'professional', 'enterprise', 'free'].includes(plan.toLowerCase()) ? plan.toLowerCase() : 'starter',
        createdAt: new Date(),
      });

      // Auto-provision initial subscription record in Atlas 'subscriptions' collection
      const planPrices = {
        free: 0,
        starter: 29,
        professional: 79,
        enterprise: 249,
      };

      const planDisplayNames = {
        free: 'Starter',
        starter: 'Starter',
        professional: 'Professional',
        enterprise: 'Enterprise',
      };

      const renewalDate = new Date();
      renewalDate.setMonth(renewalDate.getMonth() + 1);

      const newSub = await Subscription.create({
        userId: newUser._id,
        planName: planDisplayNames[newUser.plan] || 'Starter',
        status: 'active',
        startDate: new Date(),
        renewalDate: renewalDate,
        amount: planPrices[newUser.plan] ?? 29,
      });

      // Return sanitized user (WITHOUT passwordHash)
      res.status(201).json({
        message: 'User successfully created and stored in MongoDB Atlas',
        targetDatabase: newUser.db?.name || 'saas_db',
        targetCollection: 'users',
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          plan: newUser.plan,
          createdAt: newUser.createdAt,
        },
        subscription: {
          _id: newSub._id,
          planName: newSub.planName,
          status: newSub.status,
          amount: newSub.amount,
          renewalDate: newSub.renewalDate,
        },
      });
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 11000) {
        return res.status(409).json({ error: 'Email address already exists in Atlas' });
      }
      res.status(400).json({ error: error.message || 'Failed to create user in Atlas' });
    }
  });

  // 3. POST /api/subscriptions - Creates a subscription document linked to a user in Atlas
  app.post('/api/subscriptions', async (req, res) => {
    try {
      const { userId, planName, status = 'active', amount, renewalDate } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required to link subscription' });
      }

      // Verify user exists in Atlas
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Target user not found in Atlas database' });
      }

      if (!planName) {
        return res.status(400).json({ error: 'planName is required (Starter, Professional, Enterprise, Custom)' });
      }

      const defaultPrices = {
        Starter: 29,
        Professional: 79,
        Enterprise: 249,
        Custom: 499,
      };

      const finalAmount = amount !== undefined ? Number(amount) : defaultPrices[planName] || 29;

      const finalRenewalDate = renewalDate
        ? new Date(renewalDate)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const subscription = await Subscription.create({
        userId: user._id,
        planName,
        status: ['active', 'trialing', 'canceled'].includes(status) ? status : 'active',
        startDate: new Date(),
        renewalDate: finalRenewalDate,
        amount: finalAmount,
      });

      // Also update user's plan field if upgraded
      if (['Starter', 'Professional', 'Enterprise'].includes(planName)) {
        user.plan = planName.toLowerCase();
        await user.save();
      }

      const populatedSub = await Subscription.findById(subscription._id).populate('userId', 'name email plan');

      res.status(201).json({
        message: 'Subscription created and saved to MongoDB Atlas',
        targetCollection: 'subscriptions',
        subscription: populatedSub,
      });
    } catch (error) {
      console.error('Create subscription error:', error);
      res.status(400).json({ error: error.message || 'Failed to create subscription in Atlas' });
    }
  });

  // 4. GET /api/users - List all users from Atlas (no passwords)
  app.get('/api/users', async (req, res) => {
    try {
      const { search, plan, limit = 50, page = 1 } = req.query;

      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }
      if (plan && plan !== 'all') {
        query.plan = plan.toLowerCase();
      }

      const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
      const total = await User.countDocuments(query);
      const users = await User.find(query, '-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10));

      // Get subscription counts for each user
      const userIds = users.map((u) => u._id);
      const subscriptions = await Subscription.find({ userId: { $in: userIds } });

      const enrichedUsers = users.map((u) => {
        const userSubs = subscriptions.filter((s) => s.userId.toString() === u._id.toString());
        const activeSub = userSubs.find((s) => s.status === 'active') || userSubs[0];
        return {
          ...u.toObject(),
          activeSubscription: activeSub || null,
          subscriptionCount: userSubs.length,
        };
      });

      res.json({
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        database: User.db?.name || 'saas_db',
        collection: 'users',
        users: enrichedUsers,
      });
    } catch (error) {
      console.error('Fetch users error:', error);
      res.status(500).json({ error: error.message || 'Failed to retrieve users from Atlas' });
    }
  });

  // 5. GET /api/subscriptions - List all subscriptions from Atlas with populated user info
  app.get('/api/subscriptions', async (req, res) => {
    try {
      const { status, limit = 50 } = req.query;
      const query = {};
      if (status && status !== 'all') {
        query.status = status;
      }

      const subscriptions = await Subscription.find(query)
        .populate('userId', 'name email plan createdAt')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit, 10));

      res.json({
        total: subscriptions.length,
        database: Subscription.db?.name || 'saas_db',
        collection: 'subscriptions',
        subscriptions,
      });
    } catch (error) {
      console.error('Fetch subscriptions error:', error);
      res.status(500).json({ error: error.message || 'Failed to retrieve subscriptions from Atlas' });
    }
  });

  // 6. GET /api/stats - Live summary metrics directly from Atlas collections
  app.get('/api/stats', async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const activeSubs = await Subscription.countDocuments({ status: 'active' });
      const trialingSubs = await Subscription.countDocuments({ status: 'trialing' });
      const canceledSubs = await Subscription.countDocuments({ status: 'canceled' });

      // Calculate MRR
      const activeSubDocs = await Subscription.find({ status: 'active' });
      const mrr = activeSubDocs.reduce((sum, s) => sum + (s.amount || 0), 0);

      // Plan breakdown
      const starterUsers = await User.countDocuments({ plan: 'starter' });
      const proUsers = await User.countDocuments({ plan: 'professional' });
      const enterpriseUsers = await User.countDocuments({ plan: 'enterprise' });

      res.json({
        totalUsers,
        activeSubscriptions: activeSubs,
        trialingSubscriptions: trialingSubs,
        canceledSubscriptions: canceledSubs,
        mrr,
        planBreakdown: {
          starter: starterUsers,
          professional: proUsers,
          enterprise: enterpriseUsers,
        },
        databaseName: User.db?.name || 'saas_db',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 7. POST /api/seed - Trigger or re-run seed process
  app.post('/api/seed', async (req, res) => {
    try {
      const { force = false } = req.body || {};
      const result = await runSeed(force);
      res.json(result);
    } catch (error) {
      console.error('Seed API error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 8. DELETE /api/users/:id - Delete test user & associated subscriptions
  app.delete('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ error: 'User document not found in Atlas' });
      }

      await Subscription.deleteMany({ userId: id });

      res.json({
        message: `User ${user.email} and related subscriptions deleted from Atlas`,
        deletedUserId: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // 9. PATCH /api/subscriptions/:id - Update subscription status
  app.patch('/api/subscriptions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, planName, amount } = req.body;

      const updateData = {};
      if (status) updateData.status = status;
      if (planName) updateData.planName = planName;
      if (amount !== undefined) updateData.amount = Number(amount);

      const sub = await Subscription.findByIdAndUpdate(id, updateData, { new: true }).populate('userId', 'name email plan');

      if (!sub) {
        return res.status(404).json({ error: 'Subscription document not found in Atlas' });
      }

      res.json({
        message: 'Subscription updated in Atlas',
        subscription: sub,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ----------------------------------------------------
  // VITE MIDDLEWARE & STATIC SERVING
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SaaS Platform Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
});
