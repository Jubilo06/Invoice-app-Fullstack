import axios from 'axios';

// const isProduction = import.meta.env.PROD;
// const isDevelopment = import.meta.env.DEV;

// // Get the Vercel-specific environment variable if it exists
// const vercelEnv = import.meta.env.VITE_VERCEL_ENV;

// let baseURL;

// if (isProduction || vercelEnv === 'production' || vercelEnv === 'preview') {
//   // We are on a live Vercel deployment (either production or a preview branch).
//   // The API is at a relative path on the same domain.
//   baseURL = '/';
// } else {
//   // We are in local development. Use the full localhost URL.
//   baseURL = 'http://localhost:5014/api';
// }

// console.log(`[API Config] Environment: ${isProduction ? 'Production' : 'Development'}`);
// console.log(`[API Config] Vercel Env: ${vercelEnv}`);
// console.log(`[API Config] Base URL set to: ${baseURL}`);
let baseURL;
if (import.meta.env.PROD) {
  // On Vercel, all calls are relative to the root of the domain.
  baseURL = '/';
} else {
  // On local dev, use the full backend URL.
  baseURL = 'http://localhost:5014';
}
console.log(`[AuthContext] API Base URL is: ${baseURL}`);
const api = axios.create({
  baseURL: baseURL,
  timeout: 30000,  // Longer for mobile
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
    const fullUrl = new URL(config.url, config.baseURL || window.location.origin).href;
    console.log('API Request Details:', {
      method: config.method.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: fullUrl,
      origin: window.location.origin,
      withCredentials: config.withCredentials
    });
    return config;
  },error => {
    console.error('Request Setup Error:', error);
    return Promise.reject(error);
  }
);
  api.interceptors.response.use(
    response => {
      console.log('API Success:', response.status, response.config.url);
      return response;
    },
    error => {
      const fullUrl = error.config ? new URL(error.config.url, error.config.baseURL || window.location.origin).href : 'Unknown';
      console.error('API Failure Details:', {
        code: error.code,
        message: error.message,
        status: error.response?.status || 'No Response',
        url: error.config?.url,
        fullURL: fullUrl
      });
      return Promise.reject(error);
    }
  );
export default api;