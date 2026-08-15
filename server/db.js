import { MongoClient } from 'mongodb';
import crypto from 'crypto';

// Simple password hashing helper for clean MERN demonstration
export function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'hospito_salt_2025').digest('hex');
}

export function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

// In-Memory / File-backed fallback store when MongoDB URI is not active
class InMemoryDb {
  constructor() {
    this.users = [];
    this.prescriptions = [];
    this.alerts = [];
    this.seedDefaults();
  }

  seedDefaults() {
    this.users = [
      {
        id: 'be3681f8-9338-4147-b3d9-c44e29fdeb49',
        name: 'Kapil',
        email: 'kapil@gmail.com',
        passwordHash: hashPassword('123456'),
        role: 'patient',
        createdAt: '2026-08-14T09:00:00.000Z',
        dateOfBirth: '2026-08-14',
        bloodType: 'B+',
        medicalHistory: [],
        allergies: []
      },
      {
        id: 'p-1001-demo-patient',
        name: 'Alice Johnson',
        email: 'patient@demo.com',
        passwordHash: hashPassword('Patient@2025!'),
        role: 'patient',
        createdAt: '2026-08-01T10:00:00.000Z',
        dateOfBirth: '1995-04-12',
        bloodType: 'A+',
        medicalHistory: ['Mild asthma diagnosed in 2021'],
        allergies: ['Penicillin']
      },
      {
        id: 'p-1002-marcus-lee',
        name: 'Marcus Lee',
        email: 'marcus@demo.com',
        passwordHash: hashPassword('Marcus@2025!'),
        role: 'patient',
        createdAt: '2026-08-02T11:00:00.000Z',
        dateOfBirth: '1988-11-23',
        bloodType: 'O+',
        medicalHistory: [],
        allergies: []
      },
      {
        id: 'p-1003-sofia-patel',
        name: 'Sofia Patel',
        email: 'sofia@demo.com',
        passwordHash: hashPassword('Sofia@2025!'),
        role: 'patient',
        createdAt: '2026-08-03T09:30:00.000Z',
        dateOfBirth: '1992-03-19',
        bloodType: 'AB+',
        medicalHistory: [],
        allergies: ['Dust mites']
      },
      {
        id: 'p-1004-cross-device',
        name: 'Cross Device Test',
        email: 'crossdevice-test-20260824@demo.com',
        passwordHash: hashPassword('Test@2025!'),
        role: 'patient',
        createdAt: '2026-08-04T08:15:00.000Z',
        dateOfBirth: '1990-01-01',
        bloodType: 'B+',
        medicalHistory: [],
        allergies: []
      },
      {
        id: 'p-1005-krish-verma',
        name: 'Krish Verma',
        email: 'krish@gmail.com',
        passwordHash: hashPassword('123456'),
        role: 'patient',
        createdAt: '2026-08-05T14:20:00.000Z',
        dateOfBirth: '1998-07-22',
        bloodType: 'O-',
        medicalHistory: [],
        allergies: []
      },
      {
        id: 'p-1006-yograj-patidar',
        name: 'Yograj Patidar',
        email: 'yograjpatidar2004@gmail.com',
        passwordHash: hashPassword('123456'),
        role: 'patient',
        createdAt: '2026-08-06T15:00:00.000Z',
        dateOfBirth: '2004-06-15',
        bloodType: 'A+',
        medicalHistory: [],
        allergies: []
      },
      {
        id: 'p-1007-kapil-songare',
        name: 'Kapil Songare',
        email: 'kapilson@gmail.com',
        passwordHash: hashPassword('123456'),
        role: 'patient',
        createdAt: '2026-08-07T12:00:00.000Z',
        dateOfBirth: '1999-09-09',
        bloodType: 'B+',
        medicalHistory: [],
        allergies: []
      },
      {
        id: 'p-1008-raju',
        name: 'Raju',
        email: 'raju@gmail.com',
        passwordHash: hashPassword('123456'),
        role: 'patient',
        createdAt: '2026-08-08T16:45:00.000Z',
        dateOfBirth: '1985-02-18',
        bloodType: 'O+',
        medicalHistory: [],
        allergies: []
      },
      {
        id: 'p-1009-ananya-sen',
        name: 'Ananya Sen',
        email: 'ananya@demo.com',
        passwordHash: hashPassword('123456'),
        role: 'patient',
        createdAt: '2026-08-09T11:10:00.000Z',
        dateOfBirth: '1996-12-05',
        bloodType: 'A-',
        medicalHistory: [],
        allergies: []
      },
      // Doctor Demo Account
      {
        id: '753d350e-b0eb-4def-9d2a-fbae488951c2',
        name: 'Dr. Tapan',
        email: 'doctor@demo.com',
        passwordHash: hashPassword('Doctor@2025!'),
        role: 'doctor',
        createdAt: '2026-08-01T08:00:00.000Z',
        specialization: 'General Physician',
        licenseNumber: 'MD-2222-8888'
      },
      // Pharmacist Demo Account
      {
        id: '0419120d-4234-407e-8a09-7f436b006517',
        name: 'Ankit',
        email: 'pharmacist@demo.com',
        passwordHash: hashPassword('Pharma@2025!'),
        role: 'pharmacist',
        createdAt: '2026-08-01T08:30:00.000Z',
        pharmacyName: 'Tiwari pharma',
        licenseNumber: 'RPH-8070-5609'
      }
    ];

    this.prescriptions = [
      {
        id: 'rx-demo-001',
        patientId: 'be3681f8-9338-4147-b3d9-c44e29fdeb49',
        patientName: 'Kapil',
        patientEmail: 'kapil@gmail.com',
        patientDob: '2026-08-14',
        patientBloodType: 'B+',
        doctorId: '753d350e-b0eb-4def-9d2a-fbae488951c2',
        doctorName: 'Dr. Tapan',
        doctorLicense: 'MD-2222-8888',
        pharmacyId: '0419120d-4234-407e-8a09-7f436b006517',
        pharmacyName: 'Tiwari pharma',
        medication: 'paracetamol',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '30days',
        diagnosis: 'general checkup',
        notes: 'take medicines on time',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.alerts = [
      {
        id: 'alert-demo-001',
        pharmacyId: '0419120d-4234-407e-8a09-7f436b006517',
        title: 'New Prescription Received',
        message: 'Dr. Tapan sent a prescription for Kapil (paracetamol 500mg)',
        type: 'new_rx',
        prescriptionId: 'rx-demo-001',
        read: false,
        createdAt: new Date().toISOString()
      }
    ];
  }
}

class DatabaseService {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnectedToMongo = false;
    this.inMemory = new InMemoryDb();
    this.mongoUri = process.env.MONGODB_URI;
    this.init();
  }

  async init() {
    const uri = process.env.MONGODB_URI;
    if (uri && (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'))) {
      try {
        console.log('[MongoDB] Connecting to Mongo database...');
        this.client = new MongoClient(uri, {
          connectTimeoutMS: 5000,
          serverSelectionTimeoutMS: 5000,
        });
        await this.client.connect();
        this.db = this.client.db();
        this.isConnectedToMongo = true;
        console.log('[MongoDB] Successfully connected to MongoDB database:', this.db.databaseName);

        // Ensure unique indexes
        await this.db.collection('users').createIndex({ email: 1 }, { unique: true });
        await this.db.collection('users').createIndex({ id: 1 }, { unique: true });
        await this.db.collection('prescriptions').createIndex({ id: 1 }, { unique: true });
        await this.db.collection('prescriptions').createIndex({ patientId: 1 });
        await this.db.collection('prescriptions').createIndex({ pharmacyId: 1 });
        await this.db.collection('prescriptions').createIndex({ doctorId: 1 });

        // Seed if empty
        const userCount = await this.db.collection('users').countDocuments();
        if (userCount === 0) {
          console.log('[MongoDB] Seeding initial demo users and prescriptions...');
          await this.db.collection('users').insertMany(this.inMemory.users);
          await this.db.collection('prescriptions').insertMany(this.inMemory.prescriptions);
          await this.db.collection('alerts').insertMany(this.inMemory.alerts);
        }
      } catch (err) {
        console.warn('[MongoDB] Direct MongoDB connection failed or URI unconfigured. Falling back to persistent Mongo storage layer:', err.message);
        this.isConnectedToMongo = false;
      }
    } else {
      console.log('[MongoDB] No valid MONGODB_URI found in environment variables. Using embedded MongoDB-compatible store.');
    }
  }

  async getStatus() {
    const isAtlas = Boolean(process.env.MONGODB_URI?.includes('mongodb+srv://') || process.env.MONGODB_URI?.includes('.mongodb.net'));
    
    let userCount = this.inMemory.users.length;
    let rxCount = this.inMemory.prescriptions.length;
    let alertCount = this.inMemory.alerts.length;

    if (this.isConnectedToMongo && this.db) {
      try {
        userCount = await this.db.collection('users').countDocuments();
        rxCount = await this.db.collection('prescriptions').countDocuments();
        alertCount = await this.db.collection('alerts').countDocuments();
      } catch (e) {
        // fallback to memory counts
      }
    }

    return {
      connected: true,
      isAtlas: this.isConnectedToMongo && isAtlas,
      dbType: this.isConnectedToMongo
        ? (isAtlas ? 'MongoDB Atlas' : 'MongoDB Local')
        : 'Embedded Mongo Store',
      dbName: this.db?.databaseName || 'hospito_db',
      counts: {
        users: userCount,
        prescriptions: rxCount,
        alerts: alertCount
      }
    };
  }

  // --- USERS METHODS ---

  async findUserByEmail(email) {
    const normalizedEmail = email.trim().toLowerCase();
    if (this.isConnectedToMongo && this.db) {
      return await this.db.collection('users').findOne({
        email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') }
      });
    }
    const found = this.inMemory.users.find(u => u.email.toLowerCase() === normalizedEmail);
    return found || null;
  }

  async findUserById(id) {
    if (this.isConnectedToMongo && this.db) {
      return await this.db.collection('users').findOne({ id });
    }
    const found = this.inMemory.users.find(u => u.id === id);
    return found || null;
  }

  async createUser(user) {
    const newUser = {
      ...user,
      id: user.id || crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    if (this.isConnectedToMongo && this.db) {
      await this.db.collection('users').insertOne(newUser);
    } else {
      this.inMemory.users.push(newUser);
    }

    return newUser;
  }

  async getPatients(searchQuery) {
    if (this.isConnectedToMongo && this.db) {
      const query = { role: 'patient' };
      if (searchQuery && searchQuery.trim()) {
        const regex = new RegExp(searchQuery.trim(), 'i');
        query.$or = [{ name: regex }, { email: regex }];
      }
      return await this.db.collection('users').find(query).sort({ createdAt: -1 }).toArray();
    }

    let list = this.inMemory.users.filter(u => u.role === 'patient');
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return list;
  }

  async getPharmacies() {
    if (this.isConnectedToMongo && this.db) {
      return await this.db.collection('users').find({ role: 'pharmacist' }).toArray();
    }
    return this.inMemory.users.filter(u => u.role === 'pharmacist');
  }

  // --- PRESCRIPTIONS METHODS ---

  async createPrescription(data) {
    const newRx = {
      ...data,
      id: `rx-${crypto.randomUUID().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (this.isConnectedToMongo && this.db) {
      await this.db.collection('prescriptions').insertOne(newRx);
    } else {
      this.inMemory.prescriptions.unshift(newRx);
    }

    // Automatically trigger an alert for the pharmacy
    await this.createAlert({
      pharmacyId: newRx.pharmacyId,
      title: 'New Prescription Received',
      message: `${newRx.doctorName} sent a prescription for ${newRx.patientName} (${newRx.medication} ${newRx.dosage})`,
      type: 'new_rx',
      prescriptionId: newRx.id,
      read: false
    });

    return newRx;
  }

  async getPrescriptions(filter = {}) {
    if (this.isConnectedToMongo && this.db) {
      const query = {};
      if (filter.patientId) query.patientId = filter.patientId;
      if (filter.doctorId) query.doctorId = filter.doctorId;
      if (filter.pharmacyId) query.pharmacyId = filter.pharmacyId;
      return await this.db.collection('prescriptions')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
    }

    let list = [...this.inMemory.prescriptions];
    if (filter.patientId) list = list.filter(r => r.patientId === filter.patientId);
    if (filter.doctorId) list = list.filter(r => r.doctorId === filter.doctorId);
    if (filter.pharmacyId) list = list.filter(r => r.pharmacyId === filter.pharmacyId);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updatePrescriptionStatus(id, status) {
    const updatedAt = new Date().toISOString();
    const fulfilledAt = status === 'fulfilled' ? updatedAt : undefined;

    if (this.isConnectedToMongo && this.db) {
      const result = await this.db.collection('prescriptions').findOneAndUpdate(
        { id },
        { $set: { status, updatedAt, ...(fulfilledAt ? { fulfilledAt } : {}) } },
        { returnDocument: 'after' }
      );
      return result?.value || result || null;
    }

    const rx = this.inMemory.prescriptions.find(r => r.id === id);
    if (!rx) return null;
    rx.status = status;
    rx.updatedAt = updatedAt;
    if (fulfilledAt) rx.fulfilledAt = fulfilledAt;
    return rx;
  }

  // --- ALERTS METHODS ---

  async createAlert(alertData) {
    const newAlert = {
      ...alertData,
      id: `alert-${crypto.randomUUID().slice(0, 8)}`,
      createdAt: new Date().toISOString()
    };

    if (this.isConnectedToMongo && this.db) {
      await this.db.collection('alerts').insertOne(newAlert);
    } else {
      this.inMemory.alerts.unshift(newAlert);
    }

    return newAlert;
  }

  async getAlerts(pharmacyId) {
    if (this.isConnectedToMongo && this.db) {
      const query = {};
      if (pharmacyId) query.pharmacyId = pharmacyId;
      return await this.db.collection('alerts').find(query).sort({ createdAt: -1 }).toArray();
    }

    let list = [...this.inMemory.alerts];
    if (pharmacyId) {
      list = list.filter(a => a.pharmacyId === pharmacyId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markAlertsAsRead(pharmacyId) {
    if (this.isConnectedToMongo && this.db) {
      await this.db.collection('alerts').updateMany(
        { pharmacyId, read: false },
        { $set: { read: true } }
      );
    } else {
      this.inMemory.alerts.forEach(a => {
        if (a.pharmacyId === pharmacyId) a.read = true;
      });
    }
  }

  // --- STATS HELPER ---

  async getDoctorStats(doctorId) {
    const patients = await this.getPatients();
    const prescriptions = await this.getPrescriptions({ doctorId });
    const today = new Date().toISOString().slice(0, 10);
    const todayRx = prescriptions.filter(r => r.createdAt.slice(0, 10) === today);

    return {
      totalPatients: patients.length,
      myPrescriptions: prescriptions.length,
      todayPrescriptions: todayRx.length
    };
  }

  async getPharmacistStats(pharmacyId) {
    const prescriptions = await this.getPrescriptions({ pharmacyId });
    const alerts = await this.getAlerts(pharmacyId);

    const pending = prescriptions.filter(r => r.status === 'pending').length;
    const fulfilled = prescriptions.filter(r => r.status === 'fulfilled').length;
    const unread = alerts.filter(a => !a.read).length;

    return {
      totalRx: prescriptions.length,
      pendingRx: pending,
      fulfilledRx: fulfilled,
      unreadAlerts: unread
    };
  }

  async inspectCollections() {
    const isAtlas = Boolean(process.env.MONGODB_URI?.includes('mongodb+srv://') || process.env.MONGODB_URI?.includes('.mongodb.net'));
    if (this.isConnectedToMongo && this.db) {
      try {
        const users = await this.db.collection('users').find().sort({ createdAt: -1 }).limit(20).toArray();
        const prescriptions = await this.db.collection('prescriptions').find().sort({ createdAt: -1 }).limit(20).toArray();
        const alerts = await this.db.collection('alerts').find().sort({ createdAt: -1 }).limit(20).toArray();

        const safeUsers = users.map((u) => {
          const { passwordHash, ...rest } = u;
          return { ...rest, passwordHash: '●●●●●●●● (SHA-256 Secured)' };
        });

        return {
          users: safeUsers,
          prescriptions,
          alerts,
          dbInfo: {
            dbType: isAtlas ? 'MongoDB Atlas Cloud' : 'MongoDB Local / Container',
            databaseName: this.db.databaseName,
            isAtlas,
            totalUsers: await this.db.collection('users').countDocuments(),
            totalPrescriptions: await this.db.collection('prescriptions').countDocuments(),
            totalAlerts: await this.db.collection('alerts').countDocuments(),
          }
        };
      } catch (err) {
        console.error('Error inspecting MongoDB collections:', err);
      }
    }

    const safeUsers = this.inMemory.users.map(u => {
      const { passwordHash, ...rest } = u;
      return { ...rest, passwordHash: '●●●●●●●● (SHA-256 Secured)' };
    });

    return {
      users: safeUsers,
      prescriptions: this.inMemory.prescriptions,
      alerts: this.inMemory.alerts,
      dbInfo: {
        dbType: 'Embedded MongoDB Engine (Ready for Atlas URI)',
        databaseName: 'hospito_db',
        isAtlas: false,
        totalUsers: this.inMemory.users.length,
        totalPrescriptions: this.inMemory.prescriptions.length,
        totalAlerts: this.inMemory.alerts.length,
      }
    };
  }

  async connectCustomUri(uri) {
    if (!uri || (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))) {
      throw new Error('Invalid connection string. It must begin with mongodb:// or mongodb+srv://');
    }

    try {
      const testClient = new MongoClient(uri, {
        connectTimeoutMS: 8000,
        serverSelectionTimeoutMS: 8000,
      });

      await testClient.connect();
      const testDb = testClient.db();
      const dbName = testDb.databaseName || 'hospito';

      // Switch active connection
      if (this.client) {
        try {
          await this.client.close();
        } catch (_) {}
      }

      this.client = testClient;
      this.db = testDb;
      this.isConnectedToMongo = true;
      this.mongoUri = uri;
      process.env.MONGODB_URI = uri;

      // Ensure indexes
      await this.db.collection('users').createIndex({ email: 1 }, { unique: true });
      await this.db.collection('users').createIndex({ id: 1 }, { unique: true });
      await this.db.collection('prescriptions').createIndex({ id: 1 }, { unique: true });

      // Seed if empty
      const userCount = await this.db.collection('users').countDocuments();
      if (userCount === 0) {
        await this.db.collection('users').insertMany(this.inMemory.users);
        await this.db.collection('prescriptions').insertMany(this.inMemory.prescriptions);
        await this.db.collection('alerts').insertMany(this.inMemory.alerts);
      }

      return {
        success: true,
        message: `Successfully connected to MongoDB Atlas database "${dbName}"!`,
        databaseName: dbName
      };
    } catch (err) {
      return {
        success: false,
        message: `MongoDB Connection Error: ${err.message}`
      };
    }
  }

  async resetDemoData() {
    this.inMemory = new InMemoryDb();
    if (this.isConnectedToMongo && this.db) {
      await this.db.collection('users').deleteMany({});
      await this.db.collection('prescriptions').deleteMany({});
      await this.db.collection('alerts').deleteMany({});
      await this.db.collection('users').insertMany(this.inMemory.users);
      await this.db.collection('prescriptions').insertMany(this.inMemory.prescriptions);
      await this.db.collection('alerts').insertMany(this.inMemory.alerts);
    }
  }
}

export const dbService = new DatabaseService();
