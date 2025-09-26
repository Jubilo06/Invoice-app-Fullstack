import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 30000,  // Longer for mobile
    withCredentials: true,  // Cross-origin cookies
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      'X-Requested-With': 'XMLHttpRequest'  // Triggers preflight properly
    }
});
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = token;   }
//   return config;
// });
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;   }
    console.log('Sending Request (Preflight if needed):', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      withCredentials: config.withCredentials
    });
    return config;
  },error => {
    console.error('Request Setup Error:', error);
    return Promise.reject(error);
  }
);
  api.interceptors.response.use(
    response => response,
    error => {
      const corsError = error.message.includes('CORS') || error.message.includes('Network Error') || error.code === 'ERR_NETWORK';
      console.error('API Error (CORS Likely?):', {
        isCors: corsError,
        status: error.response?.status || 'Blocked (0)',
        code: error.code,
        message: error.message,
        url: error.config?.url
      });
      return Promise.reject(error);
    }
  );
export default api;