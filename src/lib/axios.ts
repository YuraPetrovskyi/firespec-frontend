import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://127.0.0.1:8000/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// ⏳ автоматично додає токен перед кожним запитом
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('config', config); // Дебаг
    // const token = localStorage.getItem('token');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⛔️ автоматична обробка 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/'; // або можна використати router.push('/')
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
