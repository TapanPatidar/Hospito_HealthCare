import React, { useState } from 'react';
import { CreditCard, X, Check, AlertCircle, User, Calendar, DollarSign } from 'lucide-react';
import { api } from '../api/client';

export default function NewSubscriptionModal({ isOpen, onClose, users = [], selectedUser = null, onSuccess }) {
  if (!isOpen) return null;

  const [targetUserId, setTargetUserId] = useState(selectedUser?._id || (users[0]?._id || ''));
  const [planName, setPlanName] = useState('Professional');
  const [status, setStatus] = useState('active');
  const [amount, setAmount] = useState('79');
  const [renewalDate, setRenewalDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePlanChange = (plan) => {
    setPlanName(plan);
    if (plan === 'Starter') setAmount('29');
    if (plan === 'Professional') setAmount('79');
    if (plan === 'Enterprise') setAmount('249');
    if (plan === 'Custom') setAmount('499');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!targetUserId) {
      setError('Please select a target user.');
      return;
    }

    setLoading(true);
    try {
      await api.createSubscription({
        userId: targetUserId,
        planName,
        status,
        amount: Number(amount),
        renewalDate: new Date(renewalDate).toISOString(),
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Create Subscription Document</h3>
              <p className="text-[11px] text-slate-500">Insert into Atlas <code className="font-mono text-emerald-700">subscriptions</code> collection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="m-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-700 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Target User */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select User (userId ref) <span className="text-rose-500">*</span>
            </label>
            <select
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
              required
            >
              <option value="" disabled>Choose a user...</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          {/* Plan Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Plan Tier</label>
            <div className="grid grid-cols-4 gap-1.5">
              {['Starter', 'Professional', 'Enterprise', 'Custom'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePlanChange(p)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition ${
                    planName === p
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold ring-1 ring-emerald-500'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Amount ($)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
              >
                <option value="active">Active</option>
                <option value="trialing">Trialing</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
          </div>

          {/* Renewal Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Next Renewal Date</label>
            <input
              type="date"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
              required
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? 'Inserting...' : 'Insert into subscriptions'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
