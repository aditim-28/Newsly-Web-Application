import axios from 'axios';

// Use environment variable or fall back to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  signup: (firstName, email, password) =>
    api.post('/auth/signup', { firstName, email, password }),
  
  signin: (email, password) =>
    api.post('/auth/signin', { email, password }),
  
  logout: () =>
    api.post('/auth/logout'),
  
  checkAuthStatus: () =>
    api.get('/auth/status')
};

// Epaper services
export const epaperService = {
  getAllEpapers: () =>
    api.get('/epaper/all'),
  
  getEpaper: (paperId) =>
    api.get(`/epaper/${paperId}`),
  
  getPdfLink: (paperId) =>
    api.get(`/epaper/${paperId}/pdf`)
};

// News services
export const newsService = {
  getHeadlines: () =>
    api.get('/news/headlines'),

  getRegionalNews: (location) =>
    api.get(`/news/regional/${location}`),

  searchNews: (query) =>
    api.get('/news/search', { params: { q: query } }),

  getCategoryNews: (topic) =>
    api.get('/news/category', { params: { topic } }),
  
  getAboutUs: () =>
    api.get('/news/about'),
  
  getContact: () =>
    api.get('/news/contact')
};

// Realtime headlines via Server-Sent Events
export const subscribeNewsStream = (onMessage, onError) => {
  const streamUrl = `${API_BASE_URL}/news/stream`;
  const es = new EventSource(streamUrl);
  es.addEventListener('headlines', (evt) => {
    try {
      const payload = JSON.parse(evt.data);
      onMessage?.(payload);
    } catch (e) {
      console.error('Stream parse error', e);
    }
  });
  es.addEventListener('error', (evt) => {
    try {
      const payload = JSON.parse(evt.data);
      onError?.(payload);
    } catch (e) {
      onError?.({ message: 'Stream error', detail: 'Unable to parse event' });
    }
  });
  es.onerror = (e) => {
    console.warn('EventSource error', e);
  };
  return () => es.close();
};

export default api;
