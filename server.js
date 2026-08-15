import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { dbService, verifyPassword, hashPassword } from './server/db.js';

dotenv.config();

// Lazy Gemini API Client
let geminiClient = null;
function getGeminiClient() {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---

  // Health check & DB Status
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/db-status', async (req, res) => {
    try {
      const status = await dbService.getStatus();
      res.json(status);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/db/status', async (req, res) => {
    try {
      const status = await dbService.getStatus();
      res.json(status);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/db/inspect', async (req, res) => {
    try {
      const data = await dbService.inspectCollections();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/db/connect', async (req, res) => {
    try {
      const { uri } = req.body;
      if (!uri) {
        return res.status(400).json({ success: false, error: 'Connection URI is required' });
      }
      const result = await dbService.connectCustomUri(uri);
      res.json(result);
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Auth - Register
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name, role, dateOfBirth, bloodType, specialization, licenseNumber, pharmacyName } = req.body;

      if (!email || !password || !name || !role) {
        return res.status(400).json({ error: 'Please provide all required fields' });
      }

      // Check if account with email already exists
      const existing = await dbService.findUserByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      const passwordHash = hashPassword(password);
      const user = await dbService.createUser({
        name,
        email,
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

      // Remove password hash from response
      const { passwordHash: _, ...safeUser } = user;
      res.status(201).json({
        user: safeUser,
        token: `hospito_token_${user.id}_${Date.now()}`
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Internal server error during registration' });
    }
  });

  // Auth - Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await dbService.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isValid = verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const { passwordHash: _, ...safeUser } = user;
      res.json({
        user: safeUser,
        token: `hospito_token_${user.id}_${Date.now()}`
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Internal server error during login' });
    }
  });

  // Auth - Me
  app.get('/api/auth/me', async (req, res) => {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const user = await dbService.findUserById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const { passwordHash: _, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Patients list (for Doctor Dashboard search)
  app.get('/api/patients', async (req, res) => {
    try {
      const query = req.query.q || req.query.search || '';
      const patients = await dbService.getPatients(query);
      const safePatients = patients.map(({ passwordHash, ...rest }) => rest);
      res.json({
        patients: safePatients,
        total: safePatients.length
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Patient detail
  app.get('/api/patients/:id', async (req, res) => {
    try {
      const patient = await dbService.findUserById(req.params.id);
      if (!patient || patient.role !== 'patient') {
        return res.status(404).json({ error: 'Patient not found' });
      }
      const prescriptions = await dbService.getPrescriptions({ patientId: patient.id });
      const { passwordHash, ...safePatient } = patient;
      res.json({
        patient: safePatient,
        prescriptions
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Pharmacies list (for Doctor prescription form dropdown)
  app.get('/api/pharmacies', async (req, res) => {
    try {
      const pharmacies = await dbService.getPharmacies();
      const safePharmacies = pharmacies.map(({ passwordHash, ...rest }) => rest);
      res.json({ pharmacies: safePharmacies });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Prescriptions - Get (filtered by patient, doctor, or pharmacy)
  app.get('/api/prescriptions', async (req, res) => {
    try {
      const { role, userId, patientId, pharmacyId, doctorId } = req.query;
      const filter = {};
      if (patientId) filter.patientId = patientId;
      if (pharmacyId) filter.pharmacyId = pharmacyId;
      if (doctorId) filter.doctorId = doctorId;

      if (!patientId && !pharmacyId && !doctorId && userId && role) {
        if (role === 'patient') filter.patientId = userId;
        if (role === 'doctor') filter.doctorId = userId;
        if (role === 'pharmacist') filter.pharmacyId = userId;
      }

      const prescriptions = await dbService.getPrescriptions(filter);
      res.json({
        prescriptions,
        total: prescriptions.length
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Prescriptions - Create (Doctor writes prescription)
  app.post('/api/prescriptions', async (req, res) => {
    try {
      const {
        patientId,
        patientName,
        patientEmail,
        patientDob,
        patientBloodType,
        doctorId,
        doctorName,
        doctorLicense,
        pharmacyId,
        pharmacyName,
        medication,
        dosage,
        frequency,
        duration,
        diagnosis,
        notes
      } = req.body;

      if (!patientId || !doctorId || !pharmacyId || !medication || !dosage || !frequency || !duration) {
        return res.status(400).json({ error: 'Missing required prescription fields' });
      }

      const newRx = await dbService.createPrescription({
        patientId,
        patientName: patientName || 'Patient',
        patientEmail: patientEmail || '',
        patientDob,
        patientBloodType,
        doctorId,
        doctorName: doctorName || 'Dr.',
        doctorLicense,
        pharmacyId,
        pharmacyName: pharmacyName || 'Pharmacy',
        medication,
        dosage,
        frequency,
        duration,
        diagnosis: diagnosis || 'General checkup',
        notes: notes || '',
        status: 'pending'
      });

      res.status(201).json({
        prescription: newRx,
        message: 'Prescription sent to pharmacy successfully!'
      });
    } catch (err) {
      console.error('Error creating prescription:', err);
      res.status(500).json({ error: 'Failed to create prescription' });
    }
  });

  // Prescriptions - Update status (Pharmacist fulfills / rejects)
  app.patch('/api/prescriptions/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['fulfilled', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be fulfilled or rejected' });
      }

      const updated = await dbService.updatePrescriptionStatus(id, status);
      if (!updated) {
        return res.status(404).json({ error: 'Prescription not found' });
      }

      res.json({ prescription: updated });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Alerts - Get (Pharmacist Live Alerts)
  app.get('/api/alerts', async (req, res) => {
    try {
      const pharmacyId = req.query.pharmacyId;
      const alerts = await dbService.getAlerts(pharmacyId);
      res.json({ alerts, total: alerts.length });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Alerts - Mark all read
  app.post('/api/alerts/mark-read', async (req, res) => {
    try {
      const { pharmacyId } = req.body;
      if (pharmacyId) {
        await dbService.markAlertsAsRead(pharmacyId);
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Doctor Stats
  app.get('/api/stats/doctor/:doctorId', async (req, res) => {
    try {
      const stats = await dbService.getDoctorStats(req.params.doctorId);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Pharmacist Stats
  app.get('/api/stats/pharmacist/:pharmacyId', async (req, res) => {
    try {
      const stats = await dbService.getPharmacistStats(req.params.pharmacyId);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reset Demo Data
  app.post('/api/seed/reset', async (req, res) => {
    try {
      await dbService.resetDemoData();
      res.json({ message: 'Demo data reset successfully!' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // AI Patient & Platform Bilingual Chatbot (/api/chat)
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, language = 'en', userRole = 'patient', userName = 'Patient' } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(message);

      // System Prompt for Hospito Healthcare AI Assistant
      const systemPrompt = `You are "Hospito AI Health & App Assistant" (हॉस्पिटो स्वास्थ्य एवं ऐप सहायक), an intelligent, compassionate, and helpful medical & platform assistant for the Hospito Healthcare Interoperability system.

Current User Context:
- Role: ${userRole}
- Name: ${userName}
- Preferred Language: ${isHindi ? 'Hindi (हिंदी)' : 'English'}

Your core duties:
1. Explain how to use the Hospito application simply and clearly:
   - For Patients: How to see active prescriptions, how doctors write them, how to copy their Patient ID (${userName}'s ID) to give to their doctor, and how to track if their pharmacy has fulfilled their medicine.
   - For Doctors: How to search patients by ID/Name, write digital prescriptions with diagnosis, dosage, and frequency, select pharmacy, and dispatch instant alerts.
   - For Pharmacists: How incoming orders arrive in real-time in the queue, how to review dosage/notes, and click "Fulfill" or "Reject".
2. Answer basic healthcare & medication questions:
   - Provide clear, simple explanations for common conditions and medicines (e.g. Paracetamol, Metformin, Amoxicillin, Cetirizine, Omeprazole, BP, Fever, Cold).
   - Explain common terms like "twice daily after meals", "empty stomach", hydration, and proper storage.
   - ALWAYS include a brief, caring medical safety reminder to follow the exact prescription given by the consulting doctor.
3. Language Behavior:
   - If language is Hindi (or user writes in Hindi/Hinglish), answer in clean, polite, easy-to-understand Hindi (देवनागरी / शुद्ध एवं सरल हिंदी).
   - If language is English, answer in clear, polite English.
   - Format responses with clean bullet points and bold highlights for easy readability. Keep answers focused and friendly (around 2-4 short paragraphs or bullet points).`;

      const ai = getGeminiClient();

      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nUser Question:\n${message}` }]
              }
            ],
          });

          const replyText = response.text || (isHindi ? 'नमस्ते! मैं आपकी किस प्रकार सहायता कर सकता हूँ?' : 'Hello! How can I help you today?');
          return res.json({
            reply: replyText,
            language: isHindi ? 'hi' : 'en',
            source: 'gemini-3.7-flash'
          });
        } catch (genError) {
          console.warn('Gemini API call failed, using intelligent built-in medical KB fallback:', genError?.message);
        }
      }

      // Intelligent Built-in Fallback Knowledge Base (Hindi & English)
      const q = message.toLowerCase();
      let fallbackReply = '';

      if (isHindi) {
        if (q.includes('उपयोग') || q.includes('use') || q.includes('kaise') || q.includes('kese') || q.includes('चलाएं') || q.includes('काम')) {
          fallbackReply = `🏥 **Hospito का उपयोग कैसे करें:**\n\n` +
            `1. **मरीज़ (Patient):** आप अपने डैशबोर्ड पर सभी एक्टिव दवाएं (Prescriptions) देख सकते हैं। अपना **Patient ID** कॉपी करके अपने डॉक्टर को दें ताकि वे सीधे आपके खाते में पर्ची भेज सकें।\n` +
            `2. **दवा कब मिलेगी (Pharmacy Tracking):** जब डॉक्टर पर्ची भेजते हैं, यह तुरंत आपकी चुनी हुई फार्मेसी को चली जाती है। जब फार्मासिस्ट दवा तैयार कर देगा, स्थिति **"Fulfilled" (तैयार)** हो जाएगी।\n` +
            `3. **डॉक्टर और फार्मासिस्ट:** डॉक्टर सीधे मरीज़ की आईडी से पर्ची लिखते हैं और फार्मासिस्ट को लाइव अलर्ट मिलता है।\n\n` +
            `💡 *क्या आप किसी खास दवा या बीमारी के बारे में जानना चाहते हैं?*`;
        } else if (q.includes('दवा') || q.includes('medicine') || q.includes('dawa') || q.includes('paracetamol') || q.includes('metformin') || q.includes('बुखार') || q.includes('दर्द')) {
          fallbackReply = `💊 **दवाइयों से जुड़ी महत्वपूर्ण जानकारी:**\n\n` +
            `• **पेरासिटामोल (Paracetamol):** सामान्य बुखार और सिरदर्द/शरीर दर्द में आराम के लिए डॉक्टर द्वारा दी जाती है। इसे खाने के बाद पानी के साथ लें।\n` +
            `• **मेटफॉर्मिन (Metformin):** टाइप 2 डायबिटीज में ब्लड शुगर नियंत्रित करने हेतु उपयोग होती है, इसे आमतौर पर भोजन के साथ लिया जाता है।\n` +
            `• **एंटीबायोटिक (जैसे Amoxicillin):** डॉक्टर द्वारा बताए गए पूरे दिन (Course) तक लेना जरूरी है।\n\n` +
            `⚠️ **सलाह:** कृपया कोई भी दवा अपने डॉक्टर द्वारा लिखी गई खुराक और समय के अनुसार ही लें। आपातकालीन स्थिति में तुरंत नजदीकी अस्पताल संपर्क करें।`;
        } else if (q.includes('नमस्ते') || q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('मदद')) {
          fallbackReply = `नमस्ते ${userName}! 🙏 मैं **Hospito AI स्वास्थ्य सहायक** हूँ।\n\nमैं आपकी इन चीज़ों में मदद कर सकता हूँ:\n` +
            `• Hospito पोर्टल का उपयोग कैसे करें (पर्ची देखना, ID शेयर करना)\n` +
            `• आपकी दवाइयों और खुराक से जुड़े सामान्य सवाल\n` +
            `• फार्मेसी और डॉक्टर से जुड़े अपडेट\n\nआप मुझसे हिंदी या अंग्रेज़ी में कुछ भी पूछ सकते हैं!`;
        } else {
          fallbackReply = `आपके प्रश्न के लिए धन्यवाद! 🌿\n\n` +
            `• **Hospito ऐप से संबंधित:** आप अपने डैशबोर्ड पर अपनी पर्ची (Prescription), बीमारी का विवरण (Diagnosis), और फार्मेसी स्टेटस देख सकते हैं।\n` +
            `• **दवाइयों के नियम:** दवाएं हमेशा सही समय पर, पर्याप्त पानी के साथ और डॉक्टर के परामर्श अनुसार लें।\n\n` +
            `यदि आपका कोई विशेष प्रश्न है, तो कृपया विस्तार से लिखें। मैं आपकी सहायता के लिए तैयार हूँ!`;
        }
      } else {
        if (q.includes('use') || q.includes('how to') || q.includes('work') || q.includes('guide') || q.includes('patient id')) {
          fallbackReply = `🏥 **How to use the Hospito Platform:**\n\n` +
            `1. **View Active Prescriptions:** Your dashboard displays all active medication orders, dosage instructions, and doctor diagnosis in real-time.\n` +
            `2. **Share Your Patient ID:** Click the **"Copy ID"** button next to your Patient ID on the top banner and provide it to your doctor during consultations.\n` +
            `3. **Track Pharmacy Fulfillment:** As soon as your doctor writes a digital prescription, it alerts your selected pharmacy. The status changes from **Pending (Amber)** to **Fulfilled (Cyan/Green)** once ready.\n` +
            `4. **Download & Print:** You can export your prescriptions as clinical JSON or printable records anytime.`;
        } else if (q.includes('medicine') || q.includes('prescription') || q.includes('metformin') || q.includes('paracetamol') || q.includes('dosage') || q.includes('pill')) {
          fallbackReply = `💊 **Medication & Healthcare Guidance:**\n\n` +
            `• **Metformin:** Commonly prescribed for Type 2 Diabetes management. Usually taken with meals to reduce stomach discomfort.\n` +
            `• **Paracetamol / Acetaminophen:** Used for mild-to-moderate pain and fever reduction.\n` +
            `• **Amoxicillin / Antibiotics:** Must be completed for the full prescribed duration, even if symptoms improve early.\n\n` +
            `⚠️ *Clinical Safety Reminder: Always follow the exact dosage and frequency prescribed by your consulting physician on your Hospito dashboard.*`;
        } else if (q.includes('hi') || q.includes('hello') || q.includes('help') || q.includes('who are you')) {
          fallbackReply = `Hello ${userName}! 👋 I'm your **Hospito AI Health & Platform Assistant**.\n\nI can help you with:\n` +
            `• Understanding how to use your Patient Portal and track prescriptions\n` +
            `• Explanations for common medications, dosage schedules, and health tips\n` +
            `• Bilingual support in **English** and **Hindi (हिंदी)**\n\nFeel free to ask any question or tap one of the suggested prompts below!`;
        } else {
          fallbackReply = `Thank you for your question! 🌿\n\n` +
            `On Hospito, your health records and digital prescriptions are seamlessly connected between your doctor and pharmacy.\n\n` +
            `• **To check your medications:** Review the cards on your active dashboard.\n` +
            `• **To contact your clinic:** Share your unique Patient ID with your doctor.\n\n` +
            `Let me know if you need specific details about a medicine, dosage, or how the pharmacy workflow functions!`;
        }
      }

      res.json({
        reply: fallbackReply,
        language: isHindi ? 'hi' : 'en',
        source: 'hospito-clinical-engine'
      });
    } catch (err) {
      console.error('Chat endpoint error:', err);
      res.status(500).json({ error: 'Failed to process chat query' });
    }
  });

  // --- VITE MIDDLEWARE SETUP ---
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
    console.log(`Hospito Full-Stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
