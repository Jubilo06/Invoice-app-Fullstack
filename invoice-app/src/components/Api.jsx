import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
  // baseURL: 'http://localhost:5014/api'
  baseURL: baseURL
});
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;   }
  return config;
});
export default api;