import axios from 'axios';

const API_BASE = process.env.REACT_APP_BACKEND_URL || '';
const API = `${API_BASE}/api`;

const api = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sentinelx_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Functions
export const healthCheck = () => api.get('/health');

export const getStats = () => api.get('/stats');

export const analyzeFeatures = (features) => api.post('/analyze/features', features);

export const adminLogin = (email, password) =>
  api.post('/admin/login', { email, password });

export const verifyAdmin = () => api.get('/admin/verify');

export const getBenchmarkResults = () => api.get('/benchmark/results');

export const runBenchmark = (n_samples = 30) => 
  api.post(`/benchmark/run?n_samples=${n_samples}`);

export const getDatasetInfo = () => api.get('/dataset/info');

export const getDatasetSamples = (page = 1, per_page = 20, label) => {
  const params = new URLSearchParams({ page: String(page), per_page: String(per_page) });
  if (label !== undefined) params.append('label', String(label));
  return api.get(`/dataset/samples?${params}`);
};

export const getModelExplanation = () => api.get('/model/explain');

export const getModelInfo = () => api.get('/model/info');

export const getRecentScans = (limit = 10) => api.get(`/scans/recent?limit=${limit}`);

export default api;
