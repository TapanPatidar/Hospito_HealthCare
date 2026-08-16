import React, { useState } from 'react';
import { CreditCard, Search, Copy, Check, Calendar, DollarSign, Plus, CheckCircle, Clock, XCircle, ArrowUpDown } from 'lucide-react';
import { api } from '../api/client';

export default function SubscriptionsTable({ subscriptions = [], isLoading, onRefresh, onOpenNewSubModal }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusToggle = async (subId, currentStatus) => {
    const nextStatusMap = {
      active: 'trialing',
      trialing: 'canceled',
      canceled: 'active',
    };
    const nextStatus = nextStatusMap[currentStatus] || 'active';
    setUpdatingId(subId);
    try {
      await api.updateSubscription(subId, { status: nextStatus });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(`Error updating subscription in Atlas: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredSubs = subscriptions.filter((sub) => {
    const userName = sub.userId?.name || '';
    const userEmail = sub.userId?.email || '';
    const plan = sub.planName || '';
    const subId = sub._id || '';

    const matchesSearch =
      userName.toLowerCase().includes(search.toLowerCase()) ||
      userEmail.toLowerCase().includes(search.toLowerCase()) ||
      plan.toLowerCase().includes(search.toLowerCase()) ||
      subId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status = 'active') => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle,
          label: 'Active',
        };
      case 'trialing':
        return {
          classes: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
          label: 'Trialing',
        };
      case 'canceled':
        return {
          classes: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: XCircle,
          label: 'Canceled',
        };
      default:
        return {
          classes: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: CheckCircle,
          label: status,
        };
    }
  };

  return (
    <div id="subscriptions-collection-table" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Atlas Collection: <code className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs">subscriptions</code>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-mono font-medium">
              {filteredSubs.length} doc(s)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Documents linking <code className="font-mono text-[11px]">userId</code> references to billing records with status enum <code className="font-mono text-[11px]">('active' | 'trialing' | 'canceled')</code>.
          </p>
        </div>

        {/* Filters and New Subscription Action */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, plan, subId..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 w-40 sm:w-48"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="trialing">Trialing</option>
            <option value="canceled">Canceled</option>
          </select>

          <button
            onClick={onOpenNewSubModal}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Doc</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-100/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Subscribed User</th>
              <th className="py-3 px-4">Plan & Amount</th>
              <th className="py-3 px-4">Status Enum</th>
              <th className="py-3 px-4">Subscription _id</th>
              <th className="py-3 px-4">Renewal Date</th>
              <th className="py-3 px-4 text-right">Quick Status Cycle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400">
                  <div className="inline-flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin"></div>
                    <span>Querying MongoDB Atlas subscriptions collection...</span>
                  </div>
                </td>
              </tr>
            ) : filteredSubs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-500">
                  <p className="font-medium text-slate-700">No subscription documents found.</p>
                  <p className="text-xs text-slate-400 mt-1">Register a user or click "New Doc" to write a subscription to Atlas.</p>
                </td>
              </tr>
            ) : (
              filteredSubs.map((sub) => {
                const badge = getStatusBadge(sub.status);
                const BadgeIcon = badge.icon;

                return (
                  <tr key={sub._id} className="hover:bg-slate-50/70 transition group">
                    {/* Subscriber info */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {sub.userId?.name || 'Unassigned User'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {sub.userId?.email || 'N/A'}
                      </div>
                    </td>

                    {/* Plan & Amount */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{sub.planName}</div>
                      <div className="text-[11px] font-mono text-slate-600 font-medium">
                        ${sub.amount} <span className="text-slate-400">/mo</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.classes}`}>
                        <BadgeIcon className="h-3 w-3" />
                        <span>{badge.label}</span>
                      </span>
                    </td>

                    {/* Subscription ObjectId */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 select-all border border-slate-200/60 truncate max-w-[140px]">
                          {sub._id}
                        </span>
                        <button
                          onClick={() => handleCopy(sub._id)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition"
                          title="Copy subscription _id"
                        >
                          {copiedId === sub._id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Renewal Date */}
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {sub.renewalDate ? new Date(sub.renewalDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }) : 'N/A'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleStatusToggle(sub._id, sub.status)}
                        disabled={updatingId === sub._id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 text-xs font-medium transition active:scale-95 disabled:opacity-50"
                        title="Toggle status in Atlas: active -> trialing -> canceled"
                      >
                        <ArrowUpDown className={`h-3 w-3 ${updatingId === sub._id ? 'animate-spin' : ''}`} />
                        <span>Change Status</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
