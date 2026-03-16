import axios from 'axios';

const api = axios.create({
  baseURL: 'https://greenroot-backend.onrender.com/api',
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gr_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gr_token');
      localStorage.removeItem('gr_user');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default api;
