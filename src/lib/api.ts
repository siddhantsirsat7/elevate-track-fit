
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (profileData: any) => {
    const response = await api.patch('/users/profile', profileData);
    return response.data;
  }
};

// Workouts API
export const workoutsAPI = {
  getAll: async () => {
    const response = await api.get('/workouts');
    return response.data;
  },
  
  getOne: async (id: string) => {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
  },
  
  create: async (workoutData: any) => {
    const response = await api.post('/workouts', workoutData);
    return response.data;
  },
  
  update: async (id: string, workoutData: any) => {
    const response = await api.patch(`/workouts/${id}`, workoutData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/workouts/${id}`);
    return response.data;
  }
};

// Goals API
export const goalsAPI = {
  getAll: async () => {
    const response = await api.get('/goals');
    return response.data;
  },
  
  getOne: async (id: string) => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },
  
  create: async (goalData: any) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },
  
  update: async (id: string, goalData: any) => {
    const response = await api.patch(`/goals/${id}`, goalData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  }
};

export default api;
