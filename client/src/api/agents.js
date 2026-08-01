import axios from "axios";

// In production, set VITE_API_URL to your deployed backend URL.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

const api = axios.create({ baseURL: API_URL, timeout: 60000 });

export async function generatePlan(tripInput) {
  const { data } = await api.post("/api/plan", tripInput);
  return data.plan;
}

export async function sendChatMessage(messages, tripContext) {
  const { data } = await api.post("/api/chat", { messages, tripContext });
  return data.reply;
}

export async function checkApiHealth() {
  try {
    const { data } = await api.get("/api/health");
    return data.ok === true;
  } catch {
    return false;
  }
}
