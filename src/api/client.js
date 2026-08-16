// API Client for SaaS Backend & MongoDB Atlas Operations

export const api = {
  // 1. Diagnostics & Health
  async getDbStatus() {
    const res = await fetch('/api/db-status');
    if (!res.ok) throw new Error('Failed to fetch DB diagnostics');
    return res.json();
  },

  async getStats() {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // 2. Users (Atlas 'users' collection)
  async getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/users?${query}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch users');
    }
    return res.json();
  },

  async signup(userData) {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to sign up user');
    }
    return data;
  },

  async deleteUser(userId) {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to delete user');
    }
    return data;
  },

  // 3. Subscriptions (Atlas 'subscriptions' collection)
  async getSubscriptions(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/subscriptions?${query}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch subscriptions');
    }
    return res.json();
  },

  async createSubscription(subData) {
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create subscription');
    }
    return data;
  },

  async updateSubscription(subId, updateData) {
    const res = await fetch(`/api/subscriptions/${subId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update subscription');
    }
    return data;
  },

  // 4. Seed Trigger
  async triggerSeed(force = false) {
    const res = await fetch('/api/seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ force }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to trigger seed');
    }
    return data;
  },
};
