import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Copy, 
  Check, 
  Pill, 
  Clock, 
  Calendar, 
  Stethoscope, 
  Building2, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  Search, 
  Share2,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { api } from '../api/client.js';

export const PatientDashboard = ({ user, onOpenDbModal }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await api.getPrescriptions({
        role: 'patient',
        patientId: user.id
      });
      setPrescriptions(data.prescriptions || []);
    } catch (err) {
      console.error('Failed to load prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
    const interval = setInterval(fetchPrescriptions, 5000);
    return () => clearInterval(interval);
  }, [user.id]);

  const handleCopyPatientId = () => {
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleExportJSON = (rx) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rx, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Hospito_Prescription_${rx.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredPrescriptions = prescriptions.filter((rx) => {
    const matchesStatus = filterStatus === 'all' || rx.status === filterStatus;
    const matchesSearch = 
      rx.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = prescriptions.filter(p => p.status === 'pending').length;
  const fulfilledCount = prescriptions.filter(p => p.status === 'fulfilled').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Patient Top Banner: Unique ID & Shareable Credentials */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-radial from-white/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 uppercase tracking-wider backdrop-blur-md border border-white/20">
                Patient Health Hub
              </span>
              <span className="text-xs text-teal-200 font-medium">Digital EHR Interoperable</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome, {user.name}
            </h1>
            
            <p className="text-xs sm:text-sm text-teal-100/90 max-w-xl leading-relaxed">
              Your electronic prescriptions and clinical dispensing orders are linked below in real-time. Share your Patient ID with any attending physician.
            </p>
          </div>

          {/* Unique Patient ID Copy Block */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 space-y-2 min-w-[280px]">
            <div className="flex items-center justify-between text-xs font-bold text-teal-100">
              <span className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Your Hospito Patient ID</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-teal-200">Share with Doctor</span>
            </div>

            <div className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-xl border border-white/10">
              <code className="text-xs font-mono font-bold text-cyan-200 truncate max-w-[180px]">
                {user.id}
              </code>
              <button
                id="btn-copy-patient-id"
                onClick={handleCopyPatientId}
                className="flex items-center space-x-1 px-3 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId ? 'Copied!' : 'Copy ID'}</span>
              </button>
            </div>

            <p className="text-[10px] text-teal-200/80">
              *Doctors enter this ID to view your allergies and submit digital prescriptions.
            </p>
          </div>

        </div>
      </motion.div>

      {/* Patient Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Prescriptions</span>
            <div className="text-2xl font-black text-slate-900">{prescriptions.length}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Pill className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dispensary Pending</span>
            <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ready / Fulfilled</span>
            <div className="text-2xl font-black text-emerald-600">{fulfilledCount}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search medications, doctor, diagnosis..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
          {['all', 'pending', 'fulfilled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-white text-teal-800 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Active & Historical Prescriptions</h2>
          <span className="text-xs text-slate-400 font-semibold">{filteredPrescriptions.length} Records</span>
        </div>

        {loading && prescriptions.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-teal-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Synchronizing with Hospito EHR database...</p>
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Pill className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-black text-slate-800">No Prescriptions Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You don't have any prescriptions matching this filter yet. When a doctor writes one using your Patient ID, it will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrescriptions.map((rx) => (
              <motion.div
                key={rx.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                {/* Rx Top Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-black text-slate-900">{rx.medication}</span>
                      <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[11px] font-extrabold border border-teal-200">
                        {rx.dosage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Diagnosis: <span className="text-slate-800 font-bold">{rx.diagnosis}</span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center space-x-1.5 ${
                      rx.status === 'fulfilled'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : rx.status === 'rejected'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                    }`}
                  >
                    {rx.status === 'fulfilled' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span className="capitalize">{rx.status === 'fulfilled' ? 'Ready for Pickup' : 'Dispensing Pending'}</span>
                  </span>
                </div>

                {/* Dosage Directions */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <div className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Frequency: <strong className="text-teal-700">{rx.frequency}</strong></span>
                    <span>Duration: <strong className="text-slate-900">{rx.duration}</strong></span>
                  </div>
                  {rx.notes && (
                    <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60 italic">
                      Doctor's Note: "{rx.notes}"
                    </p>
                  )}
                </div>

                {/* Doctor & Pharmacy Metadata */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-1.5 truncate">
                    <Stethoscope className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{rx.doctorName}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">{rx.pharmacyName}</span>
                  </div>
                </div>

                {/* Footer Export & Order ID */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                  <span>Order ID: <code className="font-bold text-slate-600 font-mono">{rx.id}</code></span>
                  <button
                    onClick={() => handleExportJSON(rx)}
                    className="flex items-center space-x-1 text-teal-700 hover:text-teal-900 font-bold transition-all cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download JSON Record</span>
                  </button>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
