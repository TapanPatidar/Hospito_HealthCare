import React, { useState } from 'react';
import { Database, X, Check, Copy, ExternalLink, ShieldCheck, Terminal, FolderCheck, Sparkles, Layers } from 'lucide-react';

export default function AtlasGuideModal({ isOpen, onClose, dbStatus }) {
  if (!isOpen) return null;

  const [copiedQuery, setCopiedQuery] = useState(null);
  const dbName = dbStatus?.databaseName || 'saas_db';
  const host = dbStatus?.host || 'cluster0.mongodb.net';

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(key);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">MongoDB Atlas Verification Guide</h3>
              <p className="text-xs text-slate-400">Step-by-step instructions to inspect your live documents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
          {/* Target Coordinates Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5 mb-2 text-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Live Atlas Destination Coordinates
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="bg-white p-2 rounded border border-emerald-200">
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Atlas Database:</span>
                <strong className="text-emerald-800 text-xs">{dbName}</strong>
              </div>
              <div className="bg-white p-2 rounded border border-emerald-200">
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Atlas Cluster:</span>
                <strong className="text-slate-800 text-xs truncate block">{host}</strong>
              </div>
            </div>
          </div>

          {/* Step-by-Step Navigation */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              How to view your live data in MongoDB Atlas:
            </h4>
            <ol className="space-y-3 pl-4 border-l-2 border-slate-200">
              <li className="relative pl-3">
                <span className="absolute -left-[19px] top-0 h-5 w-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                  1
                </span>
                <span className="font-semibold text-slate-900">Open MongoDB Atlas:</span>
                <p className="text-slate-600 mt-0.5">
                  Sign in to your account at{' '}
                  <a
                    href="https://cloud.mongodb.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 underline inline-flex items-center gap-0.5 font-medium"
                  >
                    cloud.mongodb.com <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </p>
              </li>

              <li className="relative pl-3">
                <span className="absolute -left-[19px] top-0 h-5 w-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                  2
                </span>
                <span className="font-semibold text-slate-900">Navigate to Collections:</span>
                <p className="text-slate-600 mt-0.5">
                  In the left navigation sidebar under <strong>DATABASE</strong>, click <strong>Data Explorer</strong> (or click <strong>Browse Collections</strong> on your Cluster card).
                </p>
              </li>

              <li className="relative pl-3">
                <span className="absolute -left-[19px] top-0 h-5 w-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                  3
                </span>
                <span className="font-semibold text-slate-900">Select Database & Collections:</span>
                <p className="text-slate-600 mt-0.5">
                  Click on the database named <code className="font-mono text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-bold">{dbName}</code> to see two collections:
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="font-mono font-bold text-slate-900 text-xs">users</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Contains {dbStatus?.collections?.users?.count ?? 0} user documents with hashed passwords and plans.
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="font-mono font-bold text-slate-900 text-xs">subscriptions</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Contains {dbStatus?.collections?.subscriptions?.count ?? 0} billing records referencing <code className="text-slate-700">userId</code>.
                    </div>
                  </div>
                </div>
              </li>

              <li className="relative pl-3">
                <span className="absolute -left-[19px] top-0 h-5 w-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                  4
                </span>
                <span className="font-semibold text-slate-900">Refresh to see new writes:</span>
                <p className="text-slate-600 mt-0.5">
                  MongoDB Atlas does not auto-refresh real-time. Whenever you submit a new signup, click the <strong>Refresh (↻)</strong> button in the Atlas Data Explorer header to fetch the newly written document immediately.
                </p>
              </li>
            </ol>
          </div>

          {/* Useful Filter Queries */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
              Ready-to-use Atlas Filter Queries:
            </h4>
            <div className="space-y-2">
              <div className="bg-slate-900 text-slate-200 p-2.5 rounded-xl font-mono text-[11px] flex items-center justify-between">
                <span>{`{ "plan": "enterprise" }`}</span>
                <button
                  onClick={() => copyText('{ "plan": "enterprise" }', 'q1')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 flex items-center gap-1 transition"
                >
                  {copiedQuery === 'q1' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>Copy</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-200 p-2.5 rounded-xl font-mono text-[11px] flex items-center justify-between">
                <span>{`{ "status": "active" }`}</span>
                <button
                  onClick={() => copyText('{ "status": "active" }', 'q2')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 flex items-center gap-1 transition"
                >
                  {copiedQuery === 'q2' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
          >
            Got it, close guide
          </button>
        </div>
      </div>
    </div>
  );
}
