import axios from 'axios';

// Vite proxies /api to the Express server (see vite.config.js)
const api = axios.create({ baseURL: '/api', timeout: 5000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tm_token');
  if (token && token !== 'demo') config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// True when the backend or database is not reachable -> the app switches to demo mode
export const isOffline = (err) => !err.response || err.response.status === 503 || err.response.status >= 500;
export const errMsg = (err, fallback = 'Something went wrong. Please try again.') =>
  err?.response?.data?.message || err?.message || fallback;

export default api;
