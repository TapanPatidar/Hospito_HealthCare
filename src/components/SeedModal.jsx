import React, { useState } from 'react';
import { Sparkles, X, CheckCircle, AlertCircle, Database, RefreshCw, Layers } from 'lucide-react';
import { api } from '../api/client';

export default function SeedModal({ isOpen, onClose, onSuccess, dbStatus }) {
  if (!isOpen) return null;

  const [force, setForce] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleRunSeed = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.triggerSeed(force);
      setResult(res);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to seed Atlas database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Seed MongoDB Atlas</h3>
              <p className="text-[11px] text-slate-400">Idempotent database initializer (<code className="font-mono text-emerald-400">node seed.js</code>)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-slate-600">
            This script connects to your MongoDB Atlas cluster and inserts a starter set of 5 sample users (Sarah Connor, Alex Vance, John Doe, etc.) and linked billing subscriptions.
          </p>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={force}
                onChange={(e) => setForce(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-semibold text-slate-800">Clean Re-seed (--force)</span>
                <p className="text-[11px] text-slate-500">
                  If checked, will wipe existing starter documents and insert fresh records. If unchecked, the script will skip inserting if data is already present.
                </p>
              </div>
            </label>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-slate-800 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>{result.skipped ? 'Idempotent check: Data already exists' : 'Atlas Seed Complete!'}</span>
              </div>
              <div className="font-mono text-[11px] bg-white p-2 rounded border border-emerald-200 text-slate-700 space-y-1">
                <div>Database: <strong className="text-slate-900">{result.database}</strong></div>
                <div>Users inserted: <strong className="text-emerald-700">{result.usersInserted ?? result.usersCount}</strong></div>
                <div>Subscriptions: <strong className="text-emerald-700">{result.subscriptionsInserted ?? result.subscriptionsCount}</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            Close
          </button>
          <button
            onClick={handleRunSeed}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Running seed...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>Execute Seed Script</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
