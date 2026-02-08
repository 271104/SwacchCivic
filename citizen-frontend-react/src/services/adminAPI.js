// services/adminAPI.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with admin token
const createAdminAPI = () => {
  const token = localStorage.getItem('adminToken');
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};

export const adminAPI = {
  // ==================== AUTH ====================
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/admin/login`, { email, password });
    return response.data;
  },

  getProfile: async () => {
    const api = createAdminAPI();
    const response = await api.get('/admin/profile');
    return response.data;
  },

  // ==================== DEPARTMENTS ====================
  getDepartments: async () => {
    const api = createAdminAPI();
    const response = await api.get('/admin/departments');
    return response.data;
  },

  getDepartment: async (id) => {
    const api = createAdminAPI();
    const response = await api.get(`/admin/departments/${id}`);
    return response.data;
  },

  createDepartment: async (data) => {
    const api = createAdminAPI();
    const response = await api.post('/admin/departments', data);
    return response.data;
  },

  updateDepartment: async (id, data) => {
    const api = createAdminAPI();
    const response = await api.put(`/admin/departments/${id}`, data);
    return response.data;
  },

  deleteDepartment: async (id) => {
    const api = createAdminAPI();
    const response = await api.delete(`/admin/departments/${id}`);
    return response.data;
  },

  // ==================== OFFICERS ====================
  getPendingOfficers: async () => {
    const api = createAdminAPI();
    const response = await api.get('/admin/officers/pending');
    return response.data;
  },

  getAllOfficers: async (params = {}) => {
    const api = createAdminAPI();
    const response = await api.get('/admin/officers', { params });
    return response.data;
  },

  getOfficer: async (id) => {
    const api = createAdminAPI();
    const response = await api.get(`/admin/officers/${id}`);
    return response.data;
  },

  approveOfficer: async (id) => {
    const api = createAdminAPI();
    const response = await api.put(`/admin/officers/${id}/approve`);
    return response.data;
  },

  rejectOfficer: async (id, reason) => {
    const api = createAdminAPI();
    const response = await api.put(`/admin/officers/${id}/reject`, { reason });
    return response.data;
  },

  revokeOfficer: async (id) => {
    const api = createAdminAPI();
    const response = await api.put(`/admin/officers/${id}/revoke`);
    return response.data;
  },

  activateOfficer: async (id) => {
    const api = createAdminAPI();
    const response = await api.put(`/admin/officers/${id}/activate`);
    return response.data;
  },

  changeDepartment: async (id, departmentId) => {
    const api = createAdminAPI();
    const response = await api.put(`/admin/officers/${id}/department`, { departmentId });
    return response.data;
  },

  deleteOfficer: async (id) => {
    const api = createAdminAPI();
    const response = await api.delete(`/admin/officers/${id}`);
    return response.data;
  },

  // ==================== STATISTICS ====================
  getOverviewStats: async () => {
    const api = createAdminAPI();
    const response = await api.get('/admin/stats/overview');
    return response.data;
  },

  getDepartmentStats: async (params = {}) => {
    const api = createAdminAPI();
    const response = await api.get('/admin/stats/departments', { params });
    return response.data;
  },

  getDepartmentDetailStats: async (id, params = {}) => {
    const api = createAdminAPI();
    const response = await api.get(`/admin/stats/departments/${id}`, { params });
    return response.data;
  },

  getOfficerStats: async (params = {}) => {
    const api = createAdminAPI();
    const response = await api.get('/admin/stats/officers', { params });
    return response.data;
  },

  getOfficerDetailStats: async (id) => {
    const api = createAdminAPI();
    const response = await api.get(`/admin/stats/officers/${id}`);
    return response.data;
  }
};
