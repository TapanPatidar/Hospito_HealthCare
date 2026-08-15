const API_BASE = '/api';

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  register: async (payload) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  // Patients
  getPatients: async (search) => {
    const params = new URLSearchParams();
    if (search) params.append('q', search);
    const res = await fetch(`${API_BASE}/patients?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch patients');
    return data;
  },

  getPatientDetail: async (id) => {
    const res = await fetch(`${API_BASE}/patients/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch patient detail');
    return data;
  },

  // Pharmacies
  getPharmacies: async () => {
    const res = await fetch(`${API_BASE}/pharmacies`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch pharmacies');
    return data;
  },

  // Prescriptions
  getPrescriptions: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });
    const res = await fetch(`${API_BASE}/prescriptions?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch prescriptions');
    return data;
  },

  createPrescription: async (payload) => {
    const res = await fetch(`${API_BASE}/prescriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create prescription');
    return data;
  },

  updatePrescriptionStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/prescriptions/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update prescription status');
    return data;
  },

  // Alerts
  getAlerts: async (pharmacyId) => {
    const params = new URLSearchParams();
    if (pharmacyId) params.append('pharmacyId', pharmacyId);
    const res = await fetch(`${API_BASE}/alerts?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch alerts');
    return data;
  },

  markAlertsRead: async (pharmacyId) => {
    await fetch(`${API_BASE}/alerts/mark-read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pharmacyId }),
    });
  },

  // Stats
  getDoctorStats: async (doctorId) => {
    const res = await fetch(`${API_BASE}/stats/doctor/${doctorId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch doctor stats');
    return data;
  },

  getPharmacistStats: async (pharmacyId) => {
    const res = await fetch(`${API_BASE}/stats/pharmacist/${pharmacyId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch pharmacist stats');
    return data;
  },

  // Database status & Live Inspection
  getDbStatus: async () => {
    const res = await fetch(`${API_BASE}/db/status`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch DB status');
    return data;
  },

  inspectDb: async () => {
    const res = await fetch(`${API_BASE}/db/inspect`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to inspect MongoDB collections');
    return data;
  },

  connectCustomDb: async (uri) => {
    const res = await fetch(`${API_BASE}/db/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uri }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || 'Connection failed');
    return data;
  },

  resetDemoData: async () => {
    const res = await fetch(`${API_BASE}/seed/reset`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset demo data');
  },

  // AI Bilingual Assistant
  chat: async (payload) => {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to get chat response');
    return data;
  },
};
