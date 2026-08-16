import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import SignupForm from './components/SignupForm';
import UsersTable from './components/UsersTable';
import SubscriptionsTable from './components/SubscriptionsTable';
import NewSubscriptionModal from './components/NewSubscriptionModal';
import AtlasGuideModal from './components/AtlasGuideModal';
import SeedModal from './components/SeedModal';
import { api } from './api/client';
import { Database, ShieldCheck, CheckCircle2, RefreshCw, Sparkles, Plus, ExternalLink, ArrowRight, Code, Server } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dbStatus, setDbStatus] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingSubs, setIsLoadingSubs] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [isNewSubModalOpen, setIsNewSubModalOpen] = useState(false);
  const [selectedUserForSub, setSelectedUserForSub] = useState(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isSeedModalOpen, setIsSeedModalOpen] = useState(false);

  // Fetch all live data from MongoDB Atlas
  const loadAllData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [statusRes, statsRes, usersRes, subsRes] = await Promise.allSettled([
        api.getDbStatus(),
        api.getStats(),
        api.getUsers({ limit: 100 }),
        api.getSubscriptions({ limit: 100 }),
      ]);

      if (statusRes.status === 'fulfilled') setDbStatus(statusRes.value);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.users || []);
      if (subsRes.status === 'fulfilled') setSubscriptions(subsRes.value.subscriptions || []);
    } catch (err) {
      console.error('Failed to load data from Atlas:', err);
    } finally {
      setIsRefreshing(false);
      setIsLoadingUsers(false);
      setIsLoadingSubs(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleAssignSub = (user) => {
    setSelectedUserForSub(user);
    setIsNewSubModalOpen(true);
  };

  const handleOpenNewSubGeneral = () => {
    setSelectedUserForSub(null);
    setIsNewSubModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950/5 text-slate-900 font-sans flex flex-col antialiased">
      {/* Top Header & Navigation */}
      <Header
        dbStatus={dbStatus}
        onRefresh={loadAllData}
        isRefreshing={isRefreshing}
        onOpenSeedModal={() => setIsSeedModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Key Metrics Banner */}
        <StatsCards
          stats={stats}
          dbStatus={dbStatus}
          onOpenGuide={() => setIsGuideModalOpen(true)}
        />

        {/* Tab 1: Overview & Quick Signup (Default Dashboard View) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Real-time Signup Form (Direct write to Atlas) */}
              <div className="lg:col-span-5">
                <SignupForm
                  onSuccess={loadAllData}
                  onCreatedDocument={() => loadAllData()}
                />
              </div>

              {/* Right Column: Live Atlas Collections Preview */}
              <div className="lg:col-span-7 space-y-6">
                {/* Users preview */}
                <UsersTable
                  users={users.slice(0, 5)}
                  isLoading={isLoadingUsers}
                  onRefresh={loadAllData}
                  onAssignSubscription={handleAssignSub}
                />

                {users.length > 5 && (
                  <div className="text-center pt-1">
                    <button
                      onClick={() => setActiveTab('users')}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition"
                    >
                      <span>View all {users.length} documents in users collection</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {/* Subscriptions preview */}
                <SubscriptionsTable
                  subscriptions={subscriptions.slice(0, 5)}
                  isLoading={isLoadingSubs}
                  onRefresh={loadAllData}
                  onOpenNewSubModal={handleOpenNewSubGeneral}
                />

                {subscriptions.length > 5 && (
                  <div className="text-center pt-1">
                    <button
                      onClick={() => setActiveTab('subscriptions')}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition"
                    >
                      <span>View all {subscriptions.length} documents in subscriptions collection</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Users Collection */}
        {activeTab === 'users' && (
          <div className="space-y-4 animate-fadeIn">
            <UsersTable
              users={users}
              isLoading={isLoadingUsers}
              onRefresh={loadAllData}
              onAssignSubscription={handleAssignSub}
            />
          </div>
        )}

        {/* Tab 3: Full Subscriptions Collection */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-4 animate-fadeIn">
            <SubscriptionsTable
              subscriptions={subscriptions}
              isLoading={isLoadingSubs}
              onRefresh={loadAllData}
              onOpenNewSubModal={handleOpenNewSubGeneral}
            />
          </div>
        )}

        {/* Tab 4: Atlas Explorer Inspector & Live Verification */}
        {activeTab === 'guide' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">MongoDB Atlas Inspector & Schema Guide</h2>
                    <p className="text-xs text-slate-500">Live coordinates for Database and Collections in your cluster</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsGuideModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 transition"
                >
                  Open Full Step-by-Step Guide
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* 1. Users Schema Breakdown */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-xs text-slate-900">Collection: users</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-semibold">
                      {users.length} documents
                    </span>
                  </div>
                  <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-[11px] font-mono overflow-x-auto leading-relaxed">
{`{
  "_id": ObjectId("..."),
  "name": String (required),
  "email": String (unique, lowercase),
  "passwordHash": String (bcrypt hash),
  "plan": "starter" | "professional" | "enterprise",
  "createdAt": ISODate("...")
}`}
                  </pre>
                </div>

                {/* 2. Subscriptions Schema Breakdown */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-xs text-slate-900">Collection: subscriptions</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-semibold">
                      {subscriptions.length} documents
                    </span>
                  </div>
                  <pre className="bg-slate-900 text-sky-400 p-3 rounded-lg text-[11px] font-mono overflow-x-auto leading-relaxed">
{`{
  "_id": ObjectId("..."),
  "userId": ObjectId (ref -> users),
  "planName": "Starter" | "Professional" | "Enterprise",
  "status": "active" | "trialing" | "canceled",
  "startDate": ISODate("..."),
  "renewalDate": ISODate("..."),
  "amount": Number
}`}
                  </pre>
                </div>
              </div>

              {/* Quick CLI Reference */}
              <div className="mt-6 p-4 bg-slate-900 text-slate-200 rounded-xl text-xs space-y-3">
                <div className="font-bold text-white flex items-center gap-2">
                  <Code className="h-4 w-4 text-emerald-400" />
                  <span>Terminal & Standalone Verification Commands</span>
                </div>
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                    <span># Run idempotent database seeding script:</span>
                    <code className="text-emerald-400 bg-slate-900 px-2 py-0.5 rounded">node seed.js</code>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                    <span># Clean wipe and force re-seed:</span>
                    <code className="text-emerald-400 bg-slate-900 px-2 py-0.5 rounded">node seed.js --force</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <NewSubscriptionModal
        isOpen={isNewSubModalOpen}
        onClose={() => setIsNewSubModalOpen(false)}
        users={users}
        selectedUser={selectedUserForSub}
        onSuccess={loadAllData}
      />

      <AtlasGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        dbStatus={dbStatus}
      />

      <SeedModal
        isOpen={isSeedModalOpen}
        onClose={() => setIsSeedModalOpen(false)}
        onSuccess={loadAllData}
        dbStatus={dbStatus}
      />
    </div>
  );
}
