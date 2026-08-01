import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";
const api = axios.create({ baseURL: API_URL, timeout: 20000 });

export async function signup({ name, email, password }) {
  const { data } = await api.post("/api/auth/signup", { name, email, password });
  return data;
}

export async function login({ email, password }) {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
}

export async function fetchMe(token) {
  const { data } = await api.get("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.user;
}
