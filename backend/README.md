# Hospito - MERN Stack Architecture Guide

A production-grade **MERN (MongoDB, Express.js, React, Node.js)** Healthcare Interoperability System connecting **Patients**, **Doctors**, and **Pharmacists** with digital e-prescriptions, real-time pharmacy alerts, and a bilingual AI health assistant.

---

## 📁 Project Directory Structure

```
hospito-mern/
├── backend/                  # Node.js + Express + Mongoose Backend (JavaScript)
│   ├── config/
│   │   └── db.js             # MongoDB & Mongoose connection handler
│   ├── models/               # Mongoose Data Schemas
│   │   ├── User.js           # Patient, Doctor, & Pharmacist schema
│   │   ├── Prescription.js   # Medication, dosage, diagnosis, & status schema
│   │   └── Alert.js          # Pharmacy real-time dispatch alerts schema
│   ├── controllers/          # Business logic handlers
│   │   ├── authController.js
│   │   ├── prescriptionController.js
│   │   ├── patientController.js
│   │   ├── alertController.js
│   │   └── chatController.js # Bilingual Gemini AI assistant & fallback
│   ├── routes/               # Modular Express API endpoints
│   │   ├── authRoutes.js
│   │   ├── prescriptionRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── alertRoutes.js
│   │   └── chatRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js # Token authentication & RBAC authorization
│   ├── server.js             # Express server entry point
│   └── README.md             # Backend setup & API reference
│
├── src/                      # React 19 Frontend (Vite + Tailwind CSS)
│   ├── api/                  # API client & async fetch handlers
│   ├── components/           # UI Components
│   │   ├── Header.tsx        # Navigation, quick demo switcher, role indicator
│   │   ├── ModernHero.tsx    # Modern healthcare landing & interactive overview
│   │   ├── AuthView.tsx      # Multi-role authentication & registration
│   │   ├── PatientDashboard.tsx # Patient health records & active prescription timeline
│   │   ├── DoctorDashboard.tsx  # Physician directory & digital prescription suite
│   │   ├── PharmacistDashboard.tsx # Pharmacy triage queue & live dispatch alerts
│   │   ├── HospitoChatbot.tsx# Bilingual AI assistant (English & हिंदी)
│   │   ├── MernCodeModal.tsx # Interactive MERN Stack code inspector
│   │   └── Footer.tsx        # Platform status, tech stack badges & links
│   ├── types/                # TypeScript data interfaces
│   ├── App.tsx               # Root view router & authentication state
│   ├── main.tsx              # React DOM render entry
│   └── index.css             # Tailwind CSS & global styling
│
├── package.json              # Project dependencies & build scripts
└── vite.config.ts            # Vite & Tailwind configuration
```

---

## 🚀 How to Run the MERN Stack Locally

### 1. Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or **MongoDB Atlas Connection URI**

### 2. Environment Variables (.env)
Create a `.env` file in the root or `backend/` directory:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hospito
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Install Dependencies & Start
```bash
# Install root dependencies
npm install

# Start full-stack development server
npm run dev
```

---

## 📡 REST API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Create new Patient, Doctor, or Pharmacist account
- `POST /api/auth/login` — Authenticate and receive session token
- `GET /api/auth/me` — Retrieve authenticated user profile

### 💊 Prescriptions (`/api/prescriptions`)
- `GET /api/prescriptions` — Query prescriptions with filters (`patientId`, `pharmacyId`, `doctorId`)
- `POST /api/prescriptions` — Create digital prescription & trigger pharmacy alert
- `PATCH /api/prescriptions/:id/status` — Update status to `fulfilled` or `rejected`

### 👥 Directory & Patients (`/api`)
- `GET /api/patients` — Search patient registry by name, email, or ID
- `GET /api/patients/:id` — Retrieve patient details & historical prescriptions
- `GET /api/pharmacies` — List registered dispensaries

### 🔔 Dispensary Alerts (`/api`)
- `GET /api/alerts?pharmacyId={id}` — Fetch real-time pharmacy notifications
- `POST /api/alerts/mark-read` — Mark all alerts as read
- `GET /api/stats/doctor/:doctorId` — Doctor clinical metrics
- `GET /api/stats/pharmacist/:pharmacyId` — Dispensary queue stats

### 🤖 Bilingual AI Assistant (`/api/chat`)
- `POST /api/chat` — Gemini AI health & platform queries in **English** and **Hindi (हिंदी)**
