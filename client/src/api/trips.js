import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

function authedApi(token) {
  return axios.create({
    baseURL: API_URL,
    timeout: 20000,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function saveTrip(token, { tripInput, plan, weather }) {
  const { data } = await authedApi(token).post("/api/trips", { tripInput, plan, weather });
  return data.trip;
}

export async function listTrips(token) {
  const { data } = await authedApi(token).get("/api/trips");
  return data.trips;
}

export async function getTrip(token, id) {
  const { data } = await authedApi(token).get(`/api/trips/${id}`);
  return data.trip;
}

export async function deleteTrip(token, id) {
  await authedApi(token).delete(`/api/trips/${id}`);
}
