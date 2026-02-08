import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Request with token:', config.url, 'Token exists:', !!token);
        } else {
            console.warn('No token found for request:', config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message,
            hasToken: !!localStorage.getItem('token')
        });
        
        if (error.response?.status === 401) {
            // Unauthorized - token expired or invalid
            console.log('401 Unauthorized - Token issue detected');
            
            // Don't redirect if we're already on a login page
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
                console.log('Clearing auth and redirecting to login');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // Redirect based on current path
                if (currentPath.includes('/officer')) {
                    window.location.href = '/officer/login';
                } else {
                    window.location.href = '/login';
                }
            }
        } else if (error.response?.status === 403) {
            // Forbidden - user doesn't have permission
            console.error('403 Forbidden - Access denied:', error.response?.data?.message);
            
            // Check if user is logged in
            const user = localStorage.getItem('user');
            if (!user) {
                console.log('No user found, redirecting to login');
                window.location.href = '/login';
            } else {
                // User is logged in but doesn't have permission
                console.log('User logged in but access denied - role mismatch?');
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    officerRegister: (data) => api.post('/auth/officer/register', data),
    officerLogin: (data) => api.post('/auth/officer/login', data),
};

// Complaints API
export const complaintsAPI = {
    create: (formData) => {
        return api.post('/complaints', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    getMine: () => api.get('/complaints/mine').then(res => {
        console.log('getMine response:', res.data);
        return { data: { complaints: res.data } };
    }),
    getAll: () => api.get('/complaints').then(res => {
        console.log('getAll response:', res.data);
        // Backend returns array directly, wrap it
        return { data: { complaints: Array.isArray(res.data) ? res.data : [] } };
    }),
    updateStatus: (id, status) => {
        console.log('updateStatus called with:', { id, status });
        return api.put(`/complaints/${id}/status`, { status });
    },
};

export default api;
