import axios from "axios";
import { refreshToken } from "./auth"; // окремий модуль з логікою оновлення токена

// 📦 Створюємо інстанс axios з базовими налаштуваннями
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://127.0.0.1:8000/api
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ INTERCEPTOR #1: Додаємо токен до кожного запиту
axiosInstance.interceptors.request.use(
  (config) => {
    // console.log('config', config); // Дебаг
    // const token = localStorage.getItem('token');
    // Захист: код виконується лише в браузері
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Вимикаємо HTTP кеш браузера для коректної роботи offline режиму
    // Інакше браузер може повертати кешовані відповіді замість помилки мережі
    if (config.method === "get") {
      config.headers["Cache-Control"] = "no-cache";
      config.headers["Pragma"] = "no-cache";
    }

    return config;
  },
  (error) => {
    // Якщо щось пішло не так під час формування запиту
    console.error("Request interceptor error", error);
    return Promise.reject(error);
  }
);

// ✅ INTERCEPTOR #2: Обробляємо відповіді, зокрема 401 помилки (токен протермінувався)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Якщо токен невалідний або протермінувався, і ще не було повторної спроби
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();

        if (newToken) {
          // 🔁 Підставляємо новий токен у запит і пробуємо ще раз
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } else {
          // ❌ Якщо не вдалося оновити — видаляємо токен і перекидаємо користувача
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/";
        }
      } catch (err) {
        console.error("Auto refresh failed", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
