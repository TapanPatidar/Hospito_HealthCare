import React, { useState } from 'react';
import { Users, Search, Copy, Check, Trash2, PlusCircle, Shield, Calendar, Filter, ExternalLink } from 'lucide-react';
import { api } from '../api/client';

export default function UsersTable({ users = [], isLoading, onRefresh, onAssignSubscription, onSelectUser }) {
  const [search, setSearch] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Delete user "${email}" and all associated subscriptions from Atlas?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await api.deleteUser(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(`Error deleting user: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u._id?.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = selectedPlan === 'all' || u.plan?.toLowerCase() === selectedPlan.toLowerCase();
    return matchesSearch && matchesPlan;
  });

  const getPlanBadge = (plan = 'starter') => {
    switch (plan.toLowerCase()) {
      case 'enterprise':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'professional':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'starter':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="users-collection-table" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Atlas Collection: <code className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs">users</code>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-mono font-medium">
              {filteredUsers.length} doc(s)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real documents stored in MongoDB Atlas database with unique <code className="font-mono text-[11px]">_id</code> and <code className="font-mono text-[11px]">email</code> indexes.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, _id..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 w-44 sm:w-56"
            />
          </div>

          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700"
          >
            <option value="all">All Plans</option>
            <option value="starter">Starter</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-100/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">User Document</th>
              <th className="py-3 px-4">Atlas ObjectId (_id)</th>
              <th className="py-3 px-4">Plan Tier</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4">Linked Subscriptions</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400">
                  <div className="inline-flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin"></div>
                    <span>Querying MongoDB Atlas users collection...</span>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-500">
                  <p className="font-medium text-slate-700">No user documents found in Atlas matching this query.</p>
                  <p className="text-xs text-slate-400 mt-1">Use the registration form or click "Seed Atlas" to insert starter users.</p>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/70 transition group">
                  {/* Name & Email */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                  </td>

                  {/* Mongo _id */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 select-all border border-slate-200/60 truncate max-w-[140px]">
                        {user._id}
                      </span>
                      <button
                        onClick={() => handleCopy(user._id)}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition"
                        title="Copy ObjectId for Atlas Data Explorer filter"
                      >
                        {copiedId === user._id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Plan Badge */}
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border capitalize ${getPlanBadge(user.plan)}`}>
                      {user.plan || 'starter'}
                    </span>
                  </td>

                  {/* Created At */}
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }) : 'N/A'}
                  </td>

                  {/* Subscriptions Linked */}
                  <td className="py-3 px-4">
                    {user.activeSubscription ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        {user.activeSubscription.planName} (${user.activeSubscription.amount}/mo)
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">None active</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onAssignSubscription && onAssignSubscription(user)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition border border-slate-200 hover:border-emerald-200 text-xs flex items-center gap-1"
                        title="Create new subscription document for this user"
                      >
                        <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="hidden md:inline text-[11px]">Add Sub</span>
                      </button>
                      <button
                        onClick={() => handleDelete(user._id, user.email)}
                        disabled={deletingId === user._id}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-200 disabled:opacity-50"
                        title="Delete user from Atlas"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
