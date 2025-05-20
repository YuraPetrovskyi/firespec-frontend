"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios"; // використовується для запиту /me

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;  
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Синхронізує стан з localStorage
  const setAuthFromStorage = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      setToken(null);
      setUser(null);
    }
  };

  /**
   * 🔁 Перший запуск: намагається відновити стан із localStorage
   * або отримати user з бекенду через /me, якщо тільки токен є
   */
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && !storedUser) {
        try {
          const res = await axios.get("/me", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          const fetchedUser = res.data;
          localStorage.setItem("user", JSON.stringify(fetchedUser));
          setUser(fetchedUser);
          setToken(storedToken);
        } catch (err) {
          console.error("❌ Auto-login via /me failed", err);
          logout(); // очищає все і перенаправляє
        }
      } else {
        setAuthFromStorage();
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  // 📢 Підписується на глобальні зміни auth (слухає подію "auth-updated" наприклад, після refresh)
  useEffect(() => {
    const handleAuthUpdate = () => setAuthFromStorage();

    window.addEventListener("auth-updated", handleAuthUpdate);
    return () => window.removeEventListener("auth-updated", handleAuthUpdate);
  }, []);

  // ✅ login: зберігає user і token у localStorage + оновлює стан
  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);

    // Сповіщаємо інші вкладки/компоненти
    window.dispatchEvent(new Event("auth-updated"));
    router.push("/projects");
  };

  // 🔴 logout: очищує всі дані і перенаправляє на головну
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);

    window.dispatchEvent(new Event("auth-updated"));
    router.push("/");
  };
  // console.log("user", user); // Debugging line
  // console.log("token", token); // Debugging line

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
