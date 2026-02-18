import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.66:3000', // your backend IP
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;