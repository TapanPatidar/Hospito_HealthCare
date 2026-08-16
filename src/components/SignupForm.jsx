import React, { useState } from 'react';
import { UserPlus, Lock, Mail, User as UserIcon, Check, AlertCircle, ArrowRight, Sparkles, Database } from 'lucide-react';
import { api } from '../api/client';

const PLAN_OPTIONS = [
  { id: 'starter', name: 'Starter', price: '$29/mo', desc: 'Up to 5 team members', popular: false },
  { id: 'professional', name: 'Professional', price: '$79/mo', desc: 'High-speed cloud nodes & analytics', popular: true },
  { id: 'enterprise', name: 'Enterprise', price: '$249/mo', desc: 'Dedicated cluster & 24/7 SLA', popular: false },
];

export default function SignupForm({ onSuccess, onCreatedDocument }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    plan: 'professional',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessResult(null);

    // Client-side quick checks
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError('Please provide a name of at least 2 characters.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please provide a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.signup(formData);
      setSuccessResult(response);
      setFormData({ name: '', email: '', password: '', plan: 'professional' });
      if (onSuccess) onSuccess();
      if (onCreatedDocument) onCreatedDocument(response);
    } catch (err) {
      setError(err.message || 'Failed to complete signup in Atlas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="signup-card" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">New User Registration</h2>
            <p className="text-xs text-slate-500">
              Direct write to MongoDB Atlas <code className="font-mono text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded text-[11px]">users</code> collection
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
          POST /api/signup
        </span>
      </div>

      {error && (
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs animate-fadeIn">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">Atlas Write Error:</strong>
            {error}
          </div>
        </div>
      )}

      {successResult && (
        <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs animate-fadeIn text-slate-800">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mb-1">
            <Check className="h-4 w-4" />
            <span>Document successfully inserted in Atlas!</span>
          </div>
          <div className="font-mono text-[11px] bg-white/90 p-2.5 rounded border border-emerald-200 text-slate-700 space-y-1">
            <div>
              <span className="text-slate-400">Database:</span>{' '}
              <strong className="text-slate-900">{successResult.targetDatabase || 'Atlas'}</strong>
            </div>
            <div>
              <span className="text-slate-400">Collection:</span>{' '}
              <strong className="text-emerald-700">users</strong>
            </div>
            <div>
              <span className="text-slate-400">User ObjectId (_id):</span>{' '}
              <strong className="text-slate-900 select-all">{successResult.user?._id}</strong>
            </div>
            <div>
              <span className="text-slate-400">Subscription (_id):</span>{' '}
              <strong className="text-slate-900 select-all">{successResult.subscription?._id}</strong>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <UserIcon className="h-4 w-4" />
            </div>
            <input
              id="signup-name-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Jane Foster"
              required
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 transition"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address <span className="text-rose-500">*</span> <span className="text-slate-400 font-normal">(Unique index in Atlas)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="signup-email-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jane.foster@domain.com"
              required
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 transition"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Password <span className="text-rose-500">*</span> <span className="text-slate-400 font-normal">(Hashed with bcrypt before storage)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="signup-password-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              required
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 transition"
            />
          </div>
        </div>

        {/* Plan Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Select Initial Subscription Plan
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PLAN_OPTIONS.map((plan) => {
              const isSelected = formData.plan === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, plan: plan.id }))}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                      {plan.name}
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 mt-1">{plan.price}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          id="signup-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Writing to MongoDB Atlas...</span>
            </>
          ) : (
            <>
              <span>Create User Document in Atlas</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
