import React from 'react';
import { Database, Sparkles, RefreshCw, Layers, CheckCircle2, AlertTriangle, ExternalLink, BookOpen } from 'lucide-react';

export default function Header({
  dbStatus,
  onRefresh,
  isRefreshing,
  onOpenSeedModal,
  onOpenGuideModal,
  activeTab,
  setActiveTab,
}) {
  const isConnected = dbStatus?.connected;
  const dbName = dbStatus?.databaseName || 'saas_db';

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Database className="h-5 w-5 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">CloudSaaS</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  Atlas Connected
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                MongoDB Atlas SaaS Platform &bull; Mongoose Validated Collections
              </p>
            </div>
          </div>

          {/* MongoDB Atlas Live Status Pill */}
          <div className="hidden md:flex items-center gap-3 bg-slate-950/80 px-3.5 py-1.5 rounded-lg border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                {isConnected ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                )}
              </span>
              <span className="text-slate-300 font-medium">
                {isConnected ? `Atlas DB: ${dbName}` : 'Connecting to Atlas...'}
              </span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="text-slate-400 text-[11px] font-mono">
              users: <strong className="text-slate-200">{dbStatus?.collections?.users?.count ?? 0}</strong> &bull; subs:{' '}
              <strong className="text-slate-200">{dbStatus?.collections?.subscriptions?.count ?? 0}</strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="header-refresh-btn"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700 active:scale-95 disabled:opacity-50"
              title="Refresh collections from Atlas"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              id="header-guide-btn"
              onClick={onOpenGuideModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700 active:scale-95"
            >
              <BookOpen className="h-3.5 w-3.5 text-sky-400" />
              <span className="hidden sm:inline">Atlas Guide</span>
            </button>

            <button
              id="header-seed-btn"
              onClick={onOpenSeedModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-sm transition active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
              <span>Seed Atlas</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-t border-slate-800/80 -mb-px overflow-x-auto py-1">
          <button
            id="tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 text-xs font-medium rounded-md transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Overview & Quick Signup
          </button>
          <button
            id="tab-users"
            onClick={() => setActiveTab('users')}
            className={`px-3 py-2 text-xs font-medium rounded-md transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>users collection</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-700 text-[10px] text-slate-300 font-mono">
              {dbStatus?.collections?.users?.count ?? 0}
            </span>
          </button>
          <button
            id="tab-subscriptions"
            onClick={() => setActiveTab('subscriptions')}
            className={`px-3 py-2 text-xs font-medium rounded-md transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'subscriptions'
                ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>subscriptions collection</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-700 text-[10px] text-slate-300 font-mono">
              {dbStatus?.collections?.subscriptions?.count ?? 0}
            </span>
          </button>
          <button
            id="tab-guide"
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-2 text-xs font-medium rounded-md transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-slate-800 text-sky-400 border-b-2 border-sky-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Atlas Explorer Inspector
          </button>
        </div>
      </div>
    </header>
  );
}
