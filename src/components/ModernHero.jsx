import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Stethoscope, 
  Pill, 
  User as UserIcon, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  HeartPulse, 
  CheckCircle2, 
  FileText, 
  Activity, 
  Send, 
  Search,
  Building2,
  Calendar,
  PhoneCall,
  Check,
  Languages,
  Zap,
  Lock,
  ChevronRight,
  HelpCircle,
  Copy
} from 'lucide-react';

export const ModernHero = ({ 
  onQuickDemoLogin, 
  onOpenAuth 
}) => {
  const [activeTab, setActiveTab] = useState('patient');
  const [copiedId, setCopiedId] = useState(false);

  const handleCopySample = () => {
    navigator.clipboard.writeText('PAT-9840-X12');
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="space-y-16 py-6 sm:py-10">
      
      {/* Top Pill Announcement */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold shadow-xs">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
          </span>
          <span>Unified Digital Health & E-Prescription Network</span>
          <span className="text-teal-400">•</span>
          <span className="text-teal-700 font-semibold">Real-Time Doctor & Pharmacy Connect</span>
        </div>
      </motion.div>

      {/* Main Hero Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-7xl mx-auto px-4">
        
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-extrabold tracking-wide uppercase border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Smart Clinical Interoperability</span>
            </div>
            
            <h1 className="text-4xl sm:text-5.5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Seamless Care from <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-teal-600 to-cyan-600">
                Prescription to Pharmacy
              </span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl">
            Empower your health journey with instant electronic prescriptions, live dispensary tracking, verified patient histories, and 24/7 bilingual medical guidance.
          </p>

          {/* Value points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center space-x-2.5 text-xs text-slate-700 font-bold bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Zero Lost Paper Prescriptions</span>
            </div>

            <div className="flex items-center space-x-2.5 text-xs text-slate-700 font-bold bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <span>Real-Time Dispensary Status</span>
            </div>

            <div className="flex items-center space-x-2.5 text-xs text-slate-700 font-bold bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                <Languages className="w-4 h-4" />
              </div>
              <span>Bilingual AI Guidance (EN / हिंदी)</span>
            </div>

            <div className="flex items-center space-x-2.5 text-xs text-slate-700 font-bold bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>Bank-Grade Health Privacy</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-3">
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 px-7 py-4 bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 active:scale-95 text-white text-sm font-bold rounded-2xl shadow-xl shadow-teal-700/20 transition-all cursor-pointer"
            >
              <span>Get Started • Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onQuickDemoLogin('patient')}
              className="flex items-center space-x-2 px-5 py-4 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer active:scale-95"
            >
              <UserIcon className="w-4 h-4 text-teal-600" />
              <span>Try Patient Demo</span>
            </button>
          </div>

        </div>

        {/* Right Column: Visual Health Photography Card with Interactive Overlay */}
        <div className="lg:col-span-5 relative">
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
            {/* Primary High Quality Medical Photography */}
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80"
              alt="Physician using digital tablet for clinical care"
              referrerPolicy="no-referrer"
              className="w-full h-80 sm:h-96 object-cover object-center"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

            {/* Floating Live Prescription Card */}
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Active E-Prescription</h4>
                    <p className="text-[11px] text-slate-500">Amoxicillin 500mg • 3x Daily</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-900 border border-teal-200">
                  Ready for Pickup
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700">Apollo Dispensary #4</span>
                <span className="text-teal-700 font-bold">Verified Order #RX-9281</span>
              </div>
            </div>

            {/* Floating Doctor Badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-white/60 shadow-md flex items-center space-x-2 text-xs font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Dr. Sarah Jenkins, MD</span>
            </div>
          </div>

        </div>

      </div>

      {/* 3 Interactive Role Launchcards with Rich Photography */}
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Choose Your Experience
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tailored Portals for Every Health Stakeholder
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Click any portal below to explore interactive live workflows instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Patient Portal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col group"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
                alt="Patient accessing healthcare"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-teal-500 text-white uppercase tracking-wider">
                  Patient Health Hub
                </span>
                <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg">
                  Self-Service
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900">My Health & Medications</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Access your digital prescriptions anywhere. Share your Patient ID with doctors, check dosage directions, and get instant bilingual assistance.
                </p>
                
                <ul className="text-xs text-slate-600 space-y-2 pt-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>1-Click Copyable Patient ID</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Real-time Medication Dosage Timetable</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Download Clinical Records (PDF/Text)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onQuickDemoLogin('patient')}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Launch Patient Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Doctor Suite */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col group"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"
                alt="Doctor consultation"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-600 text-white uppercase tracking-wider">
                  Doctor Clinical Suite
                </span>
                <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg">
                  Clinical Workspace
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900">Physician E-Prescribing</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Search patient records by ID, write structured digital prescriptions using rapid 1-click clinical presets, and dispatch orders directly to pharmacies.
                </p>
                
                <ul className="text-xs text-slate-600 space-y-2 pt-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Instant Patient Directory & History</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Common Drug Dosage Presets (Amoxicillin, Metformin)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Instant Dispensary Routing</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onQuickDemoLogin('doctor')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Launch Doctor Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Card 3: Pharmacy Console */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col group"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80"
                alt="Pharmacist dispensary"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-600 text-white uppercase tracking-wider">
                  Dispensary Console
                </span>
                <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg">
                  Pharmacy Queue
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900">Order Ingestion & Triage</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Receive live physician orders in real-time, cross-verify clinical dosages and instructions, and fulfill medications with 1 click.
                </p>
                
                <ul className="text-xs text-slate-600 space-y-2 pt-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Real-Time Ingestion Queue</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Live Physician Dispatch Alerts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>1-Click Fulfill & Ready Notification</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onQuickDemoLogin('pharmacist')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Launch Pharmacy Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

        </div>

      </div>

      {/* Interactive Workflow Tabs Section */}
      <div className="max-w-6xl mx-auto px-4 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Interactive Workflow
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-2">How Information Flows Across Hospito</h3>
          </div>

          {/* Segmented Controller */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('patient')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'patient'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Patient ID
            </button>

            <button
              onClick={() => setActiveTab('doctor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'doctor'
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Doctor Dispatch
            </button>

            <button
              onClick={() => setActiveTab('pharmacist')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pharmacist'
                  ? 'bg-white text-indigo-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Pharmacy Pickup
            </button>
          </div>
        </div>

        {/* Active Tab Showcase */}
        <AnimatePresence mode="wait">
          {activeTab === 'patient' && (
            <motion.div
              key="tab-patient"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <UserIcon className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-black text-slate-900">Unique Patient Digital Identity</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Every patient gets a clean, secure Patient ID. When visiting any connected doctor or clinic, simply provide your ID. The doctor instantly pulls up your medical profile and allergies to prescribe safely.
                </p>
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
                  <div className="text-[11px] font-bold text-teal-900">Example Patient ID:</div>
                  <div className="flex items-center justify-between bg-white px-3.5 py-2 rounded-xl border border-teal-200/80 font-mono text-xs text-slate-800">
                    <span>PAT-9840-X12</span>
                    <button
                      onClick={handleCopySample}
                      className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Status Preview</div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Amoxicillin 500mg</span>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-extrabold rounded-md border border-amber-200">
                      Processing
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Take 1 capsule 3 times daily after meals for 7 days</p>
                  <div className="text-[11px] text-teal-700 font-semibold pt-1 border-t border-slate-100 flex items-center justify-between">
                    <span>Dr. Sarah Jenkins</span>
                    <span>Apollo Pharmacy</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'doctor' && (
            <motion.div
              key="tab-doctor"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-black text-slate-900">1-Click Clinical E-Prescribing</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Physicians can write digital prescriptions in seconds using clinical presets for common medications (Metformin, Paracetamol, Amoxicillin). Select the patient's preferred pharmacy and dispatch instantly with zero illegible handwriting.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Metformin 500mg', 'Amoxicillin 500mg', 'Paracetamol 650mg', 'Omeprazole 20mg'].map((rx) => (
                    <span key={rx} className="px-2.5 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded-lg border border-blue-200">
                      {rx}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Physician Dispatch Stream</div>
                <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-blue-700">
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatched to Central Dispensary</span>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">Patient: John Doe • Diagnosis: Acute Bronchitis</p>
                  <p className="text-[11px] text-slate-500">Order electronically signed & transmitted in 0.4 seconds</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'pharmacist' && (
            <motion.div
              key="tab-pharmacist"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Pill className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-black text-slate-900">Real-Time Dispensary Verification</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Pharmacies receive audio-visual alert notifications the instant a doctor submits an order. Pharmacists can check packaging, verify dosage, and mark orders "Fulfilled & Ready for Pickup" with a single click.
                </p>
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1 text-xs text-indigo-950">
                  <div className="font-bold">Automated Patient Alert:</div>
                  <p className="text-[11px] text-indigo-800">"Your prescription is ready for pickup at Counter 2."</p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dispensary Fulfillment Console</div>
                <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Rx #8912 • Ready for Pickup</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold rounded-md border border-emerald-200 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Fulfilled</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Amoxicillin 500mg • Packaged with dosage guide</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Healthcare Trust Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto px-4">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center space-y-1">
          <div className="text-2.5xl sm:text-3xl font-black text-teal-700">99.8%</div>
          <div className="text-xs font-bold text-slate-800">Dispensing Accuracy</div>
          <div className="text-[11px] text-slate-400">Eliminating handwriting errors</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center space-y-1">
          <div className="text-2.5xl sm:text-3xl font-black text-blue-700">&lt; 15 sec</div>
          <div className="text-xs font-bold text-slate-800">Order Ingestion Time</div>
          <div className="text-[11px] text-slate-400">Instant physician dispatch</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center space-y-1">
          <div className="text-2.5xl sm:text-3xl font-black text-indigo-700">24/7 AI</div>
          <div className="text-xs font-bold text-slate-800">Bilingual Assistance</div>
          <div className="text-[11px] text-slate-400">English & हिन्दी guidance</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center space-y-1">
          <div className="text-2.5xl sm:text-3xl font-black text-emerald-700">100%</div>
          <div className="text-xs font-bold text-slate-800">Secure EHR Storage</div>
          <div className="text-[11px] text-slate-400">Patient privacy protected</div>
        </div>

      </div>

    </div>
  );
};
