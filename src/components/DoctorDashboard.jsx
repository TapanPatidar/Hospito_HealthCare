import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, 
  Search, 
  User, 
  PlusCircle, 
  Pill, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Building2, 
  Calendar, 
  Sparkles,
  Zap,
  Check,
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { api } from '../api/client.js';

export const DoctorDashboard = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [stats, setStats] = useState({ totalPatients: 0, myPrescriptions: 0, todayPrescriptions: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Selected Patient for E-Prescription Form
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Form State
  const [selectedPharmacyId, setSelectedPharmacyId] = useState('');
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Twice daily after meals');
  const [duration, setDuration] = useState('7 days');
  const [diagnosis, setDiagnosis] = useState('General Consultation / Viral Infection');
  const [notes, setNotes] = useState('Take with plenty of water. Complete full course.');

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Common Clinical Medication Presets
  const clinicalPresets = [
    { name: 'Paracetamol', dose: '650mg', freq: 'Every 8 hours as needed', dur: '5 days', diag: 'Acute Pyrexia & Body Ache' },
    { name: 'Amoxicillin', dose: '500mg', freq: 'Three times daily after food', dur: '7 days', diag: 'Bacterial Upper Respiratory Tract Infection' },
    { name: 'Metformin', dose: '500mg', freq: 'Twice daily with meals', dur: '30 days', diag: 'Type 2 Diabetes Mellitus' },
    { name: 'Omeprazole', dose: '20mg', freq: 'Once daily before breakfast', dur: '14 days', diag: 'Gastroesophageal Reflux Disease (GERD)' },
    { name: 'Cetirizine', dose: '10mg', freq: 'Once daily at bedtime', dur: '10 days', diag: 'Allergic Rhinitis & Seasonal Urticaria' },
  ];

  const loadData = async () => {
    try {
      const [ptsData, pharmsData, rxData, statsData] = await Promise.all([
        api.getPatients(searchQuery),
        api.getPharmacies(),
        api.getPrescriptions({ role: 'doctor', doctorId: user.id }),
        api.getDoctorStats(user.id)
      ]);

      setPatients(ptsData.patients || []);
      setPharmacies(pharmsData.pharmacies || []);
      setPrescriptions(rxData.prescriptions || []);
      setStats(statsData);

      if (pharmsData.pharmacies?.length > 0 && !selectedPharmacyId) {
        setSelectedPharmacyId(pharmsData.pharmacies[0].id);
      }
    } catch (err) {
      console.error('Failed to load doctor dashboard data:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 6000);
    return () => clearInterval(interval);
  }, [searchQuery]);

  const handleSelectPreset = (preset) => {
    setMedication(preset.name);
    setDosage(preset.dose);
    setFrequency(preset.freq);
    setDuration(preset.dur);
    setDiagnosis(preset.diag);
  };

  const handleSelectPatient = (pt) => {
    setSelectedPatient(pt);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSendPrescription = async (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      setErrorMessage('Please select a patient from the directory first.');
      return;
    }
    if (!selectedPharmacyId) {
      setErrorMessage('Please choose a dispensary pharmacy.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const targetPharmacy = pharmacies.find(p => p.id === selectedPharmacyId);

    try {
      await api.createPrescription({
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        patientEmail: selectedPatient.email,
        patientDob: selectedPatient.dateOfBirth,
        patientBloodType: selectedPatient.bloodType,
        doctorId: user.id,
        doctorName: user.name,
        doctorLicense: user.licenseNumber || 'MD-2025-LIC',
        pharmacyId: selectedPharmacyId,
        pharmacyName: targetPharmacy ? (targetPharmacy.pharmacyName || targetPharmacy.name) : 'Central Pharmacy',
        medication,
        dosage,
        frequency,
        duration,
        diagnosis,
        notes
      });

      setSuccessMessage(`Prescription for ${selectedPatient.name} successfully transmitted to dispensary!`);
      // Reset medication form
      setMedication('');
      setDosage('');
      loadData();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to dispatch prescription');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Doctor Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-800 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/30 uppercase tracking-wider backdrop-blur-md border border-blue-400/30">
              Doctor Clinical Workspace
            </span>
            <span className="text-xs text-blue-200 font-medium">{user.specialization || 'General Practice'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Dr. {user.name}
          </h1>

          <p className="text-xs sm:text-sm text-blue-200 max-w-xl leading-relaxed">
            Search patient records by Unique ID or name, write structured digital prescriptions with clinical presets, and dispatch orders to pharmacies in real time.
          </p>
        </div>

        {/* Doctor Clinical Metrics */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
            <div className="text-2xl font-black text-cyan-300">{stats.totalPatients}</div>
            <div className="text-[10px] uppercase font-bold text-blue-200">Total Patients</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
            <div className="text-2xl font-black text-emerald-300">{stats.myPrescriptions}</div>
            <div className="text-[10px] uppercase font-bold text-blue-200">Dispatched Rx</div>
          </div>
        </div>
      </motion.div>

      {/* Main 2-Column Clinical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (5 cols): Patient Directory & Search */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Patient Directory</h3>
                <p className="text-xs text-slate-500">Select a patient to prescribe</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                {patients.length} Registered
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient name, email, or ID..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            {/* Patient Cards List */}
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {patients.map((pt) => {
                const isSelected = selectedPatient?.id === pt.id;
                return (
                  <div
                    key={pt.id}
                    onClick={() => handleSelectPatient(pt)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-500 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-slate-900">{pt.name}</span>
                        {pt.bloodType && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200">
                            {pt.bloodType}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                        ID: <code className="font-mono text-[10px] text-slate-700 font-bold">{pt.id}</code>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 text-blue-600 font-bold text-xs">
                      <span>{isSelected ? 'Active' : 'Select'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Right Col (7 cols): E-Prescription Clinical Form */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            
            {/* Form Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">E-Prescription Composer</h3>
                <p className="text-xs text-slate-500">
                  {selectedPatient
                    ? `Prescribing for: ${selectedPatient.name}`
                    : 'Select a patient from the left column to begin prescribing'}
                </p>
              </div>

              {selectedPatient && (
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  <span>{selectedPatient.name}</span>
                </div>
              )}
            </div>

            {/* Quick Presets Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span className="flex items-center space-x-1.5 text-blue-700 font-extrabold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>1-Click Clinical Medication Presets:</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Click to populate fields</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {clinicalPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
                  >
                    + {preset.name} {preset.dose}
                  </button>
                ))}
              </div>
            </div>

            {/* Alerts Feedback */}
            {successMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Prescription Form */}
            <form onSubmit={handleSendPrescription} className="space-y-4">
              
              {/* Pharmacy Target */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination Dispensary / Pharmacy
                </label>
                <select
                  required
                  value={selectedPharmacyId}
                  onChange={(e) => setSelectedPharmacyId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500"
                >
                  {pharmacies.map((ph) => (
                    <option key={ph.id} value={ph.id}>
                      {ph.pharmacyName || ph.name} • {ph.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Medication & Dosage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Medication Name</label>
                  <input
                    type="text"
                    required
                    value={medication}
                    onChange={(e) => setMedication(e.target.value)}
                    placeholder="e.g. Amoxicillin, Metformin"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dosage / Strength</label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 500mg, 10ml, 1 tablet"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Frequency & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    required
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="e.g. Twice daily after meals"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 7 days, 30 days"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Clinical Diagnosis */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Diagnosis</label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Pharyngitis / Type 2 Diabetes"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Physician Directions & Advice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Directions & Patient Advice</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions for patient and pharmacist..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Dispatch Action */}
              <button
                type="submit"
                disabled={submitting || !selectedPatient}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Transmitting to Pharmacy...' : 'Electronically Transmit Prescription'}</span>
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};
