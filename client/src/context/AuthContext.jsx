import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { signup as apiSignup, login as apiLogin, fetchMe } from "../api/auth";

const AuthContext = createContext(null);
const STORAGE_KEY = "ai-travel-assistant:auth";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!token) {
      setReady(true);
      return;
    }
    fetchMe(token)
      .then(setUser)
      .catch(() => {
        setToken(null);
        localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => setReady(true));
  }, [token]);

  const signup = useCallback(async (form) => {
    const data = await apiSignup(form);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(STORAGE_KEY, data.token);
    return data.user;
  }, []);

  const login = useCallback(async (form) => {
    const data = await apiLogin(form);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(STORAGE_KEY, data.token);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, ready, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
