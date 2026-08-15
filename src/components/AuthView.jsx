import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Stethoscope, 
  Pill, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Building,
  Calendar,
  Droplet
} from 'lucide-react';
import { api } from '../api/client.js';

export const AuthView = ({ onAuthSuccess, onCancel }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('patient');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1996-05-12');
  const [bloodType, setBloodType] = useState('O+');
  const [specialization, setSpecialization] = useState('General Physician');
  const [licenseNumber, setLicenseNumber] = useState('MD-8921-X');
  const [pharmacyName, setPharmacyName] = useState('Central City Dispensary');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Quick preset logins for instant demo
  const handleQuickDemo = (demoRole) => {
    if (demoRole === 'patient') {
      setEmail('kapil@gmail.com');
      setPassword('123456');
      setRole('patient');
    } else if (demoRole === 'doctor') {
      setEmail('doctor@demo.com');
      setPassword('Doctor@2025!');
      setRole('doctor');
    } else if (demoRole === 'pharmacist') {
      setEmail('pharmacist@demo.com');
      setPassword('Pharma@2025!');
      setRole('pharmacist');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        const payload = {
          name,
          email,
          password,
          role,
          dateOfBirth: role === 'patient' ? dateOfBirth : undefined,
          bloodType: role === 'patient' ? bloodType : undefined,
          specialization: role === 'doctor' ? specialization : undefined,
          licenseNumber: (role === 'doctor' || role === 'pharmacist') ? licenseNumber : undefined,
          pharmacyName: role === 'pharmacist' ? pharmacyName : undefined,
        };
        const data = await api.register(payload);
        onAuthSuccess(data.user, data.token);
      } else {
        const data = await api.login(email, password);
        onAuthSuccess(data.user, data.token);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6"
      >
        
        {/* Header Title */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Encrypted Health Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isRegister ? 'Create Your Hospito Account' : 'Welcome Back to Hospito'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isRegister ? 'Join our interoperable network for clinical care & dispensary access' : 'Enter your credentials or click any demo account below'}
          </p>
        </div>

        {/* Quick Demo Credentials Bar */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Instant Demo Logins:</span>
            <span className="text-teal-700 font-bold">1-Click Auto Fill</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('patient')}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-teal-50 hover:border-teal-300 text-xs font-bold text-slate-700 border border-slate-200 transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>Patient</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('doctor')}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-blue-50 hover:border-blue-300 text-xs font-bold text-slate-700 border border-slate-200 transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
              <span>Doctor</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('pharmacist')}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-indigo-50 hover:border-indigo-300 text-xs font-bold text-slate-700 border border-slate-200 transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Pill className="w-3.5 h-3.5 text-indigo-600" />
              <span>Pharmacy</span>
            </button>
          </div>
        </div>

        {/* Role Picker (if Registering) */}
        {isRegister && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Select Your Role:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center space-y-1 ${
                  role === 'patient'
                    ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4 text-teal-600" />
                <span>Patient</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center space-y-1 ${
                  role === 'doctor'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <span>Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('pharmacist')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center space-y-1 ${
                  role === 'pharmacist'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Pill className="w-4 h-4 text-indigo-600" />
                <span>Pharmacist</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kapil Songare or Dr. Sarah Jenkins"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Role specific registration metadata */}
          {isRegister && role === 'patient' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Blood Type</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {isRegister && role === 'doctor' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">License No.</label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
            </div>
          )}

          {isRegister && role === 'pharmacist' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pharmacy / Dispensary Name</label>
                <input
                  type="text"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">RPh License Number</label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-teal-600 via-blue-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow-lg shadow-teal-700/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : (isRegister ? 'Complete Registration' : 'Sign In to Portal')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Toggle Mode */}
        <div className="pt-2 text-center text-xs text-slate-500">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="font-bold text-teal-700 hover:text-teal-800 underline cursor-pointer"
              >
                Sign In here
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="font-bold text-teal-700 hover:text-teal-800 underline cursor-pointer"
              >
                Create an account
              </button>
            </span>
          )}
        </div>

        {onCancel && (
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ← Back to Homepage
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
};
