import React from 'react';
import { Users, CreditCard, DollarSign, Activity, ArrowUpRight, CheckCircle, ShieldCheck } from 'lucide-react';

export default function StatsCards({ stats, dbStatus, onOpenGuide }) {
  const mrr = stats?.mrr || 0;
  const totalUsers = stats?.totalUsers ?? dbStatus?.collections?.users?.count ?? 0;
  const activeSubs = stats?.activeSubscriptions ?? dbStatus?.collections?.subscriptions?.count ?? 0;
  const isConnected = dbStatus?.connected;
  const dbName = dbStatus?.databaseName || 'saas_db';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Persisted Users */}
      <div id="stat-card-users" className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Atlas Users</span>
          <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{totalUsers}</span>
          <span className="text-xs font-medium text-emerald-600 flex items-center">
            <CheckCircle className="h-3 w-3 mr-0.5" />
            Atlas Synced
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">Documents in <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded text-[11px]">users</code></p>
      </div>

      {/* 2. Active Subscriptions */}
      <div id="stat-card-subscriptions" className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Subscriptions</span>
          <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{activeSubs}</span>
          <span className="text-xs text-slate-500 font-mono">
            {stats?.trialingSubscriptions ? `${stats.trialingSubscriptions} trial` : 'Active plans'}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">Documents in <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded text-[11px]">subscriptions</code></p>
      </div>

      {/* 3. Monthly Recurring Revenue (MRR) */}
      <div id="stat-card-mrr" className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live MRR</span>
          <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">${mrr.toLocaleString()}</span>
          <span className="text-xs font-medium text-indigo-600 font-mono">USD/mo</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">Calculated from Atlas active amounts</p>
      </div>

      {/* 4. MongoDB Atlas Connection State */}
      <div
        id="stat-card-db-state"
        onClick={onOpenGuide}
        className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-white shadow-xs hover:border-emerald-500/50 transition cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Database Engine</span>
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-bold text-white font-mono tracking-tight truncate">
            {dbName}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
          <span>MongoDB Atlas Cluster</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
        </div>
      </div>
    </div>
  );
}
