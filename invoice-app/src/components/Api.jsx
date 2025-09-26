import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 20000,  // Longer for mobile
    withCredentials: true,  // Cross-origin cookies
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
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
    console.log('API Request Details:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      withCredentials: config.withCredentials,
      origin: window.location.origin
    });
    return config;
  });
  api.interceptors.response.use(
    response => {
      console.log('API Success:', response.status, response.config.url);
      return response;
    },
    error => {
      console.error('API Failure Details:', {
        status: error.response?.status || 'No Response',
        code: error.code,
        message: error.message,
        url: error.config?.url
      });
      return Promise.reject(error);
    }
  );
export default api;