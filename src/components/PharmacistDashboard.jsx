import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Pill, 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  User, 
  Stethoscope, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  FileText,
  AlertTriangle,
  Sparkles,
  Check,
  RotateCcw
} from 'lucide-react';
import { api } from '../api/client.js';

export const PharmacistDashboard = ({ user }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ totalRx: 0, pendingRx: 0, fulfilledRx: 0, unreadAlerts: 0 });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rxData, alertsData, statsData] = await Promise.all([
        api.getPrescriptions({ role: 'pharmacist', pharmacyId: user.id }),
        api.getAlerts(user.id),
        api.getPharmacistStats(user.id)
      ]);

      setPrescriptions(rxData.prescriptions || []);
      setAlerts(alertsData.alerts || []);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load pharmacist data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [user.id]);

  const handleUpdateStatus = async (id, newStatus) => {
    setProcessingId(id);
    try {
      await api.updatePrescriptionStatus(id, newStatus);
      await loadData();
    } catch (err) {
      console.error('Failed to update prescription status:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleClearAlerts = async () => {
    try {
      await api.markAlertsRead(user.id);
      loadData();
    } catch (err) {
      console.error('Failed to mark alerts as read:', err);
    }
  };

  const filteredPrescriptions = prescriptions.filter((rx) => {
    const matchesStatus = filterStatus === 'all' || rx.status === filterStatus;
    const matchesSearch = 
      rx.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Pharmacist Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/30 uppercase tracking-wider backdrop-blur-md border border-indigo-400/30">
              Dispensary & Pharmacy Console
            </span>
            <span className="text-xs text-indigo-200 font-medium">{user.pharmacyName || 'Central Dispensary'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {user.name}
          </h1>

          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl leading-relaxed">
            Review incoming doctor e-prescriptions, verify dosages, and mark medications ready for patient pickup with automated status alerts.
          </p>
        </div>

        {/* Pharmacy Metrics */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
            <div className="text-2xl font-black text-amber-400">{stats.pendingRx}</div>
            <div className="text-[10px] uppercase font-bold text-indigo-200">Pending Triage</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
            <div className="text-2xl font-black text-emerald-400">{stats.fulfilledRx}</div>
            <div className="text-[10px] uppercase font-bold text-indigo-200">Dispensed</div>
          </div>
        </div>
      </motion.div>

      {/* Live Ingestion Alerts Bar (if any alerts) */}
      {alerts.length > 0 && (
        <div className="bg-white p-5 rounded-3xl border border-indigo-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs">
              <Bell className="w-4 h-4 text-indigo-600 animate-bounce" />
              <span>Real-Time Ingestion Queue ({alerts.filter(a => !a.read).length} New Alerts)</span>
            </div>

            <button
              onClick={handleClearAlerts}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Mark All Read
            </button>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-2xl border text-xs whitespace-nowrap flex items-center space-x-2 shrink-0 ${
                  !alert.read ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls & Status Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search prescriptions by patient, doctor, medicine..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Filter Segment */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
          {['pending', 'fulfilled', 'all'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-white text-indigo-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'pending' ? 'Pending Orders' : st}
            </button>
          ))}
        </div>

      </div>

      {/* Prescriptions Ingestion Table / Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Prescription Fulfillment Queue</h2>
          <span className="text-xs text-slate-400 font-semibold">{filteredPrescriptions.length} Orders</span>
        </div>

        {filteredPrescriptions.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Pill className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-black text-slate-800">No Prescriptions in this Queue</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When doctors dispatch new e-prescriptions assigned to this pharmacy, they will appear here with instant audio-visual alerts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrescriptions.map((rx) => {
              const isProcessing = processingId === rx.id;
              return (
                <motion.div
                  key={rx.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  
                  {/* Top Patient & Order ID */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-black text-slate-900">{rx.patientName}</span>
                        {rx.patientBloodType && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200">
                            {rx.patientBloodType}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Patient ID: <code className="font-mono text-slate-700 font-bold">{rx.patientId}</code>
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center space-x-1.5 ${
                        rx.status === 'fulfilled'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : rx.status === 'rejected'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                      }`}
                    >
                      <span className="capitalize">{rx.status}</span>
                    </span>
                  </div>

                  {/* Medication Clinical Detail */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-indigo-950">{rx.medication}</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-extrabold text-[11px]">
                        {rx.dosage}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                      <div>Frequency: <strong className="text-slate-800">{rx.frequency}</strong></div>
                      <div>Duration: <strong className="text-slate-800">{rx.duration}</strong></div>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      Diagnosis: <strong className="text-slate-800">{rx.diagnosis}</strong>
                    </div>

                    {rx.notes && (
                      <p className="text-[11px] text-slate-600 italic">
                        Directions: "{rx.notes}"
                      </p>
                    )}
                  </div>

                  {/* Doctor Info */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span className="flex items-center space-x-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                      <span>{rx.doctorName}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Order: {rx.id}
                    </span>
                  </div>

                  {/* Pharmacist Actions */}
                  {rx.status === 'pending' ? (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <button
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(rx.id, 'fulfilled')}
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Fulfill & Ready</span>
                      </button>

                      <button
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(rx.id, 'rejected')}
                        className="py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 disabled:opacity-50 text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 text-center font-semibold">
                      {rx.status === 'fulfilled'
                        ? '✅ Dispensed and ready for patient collection'
                        : '❌ Rejected / Cancelled Order'}
                    </div>
                  )}

                </motion.div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
