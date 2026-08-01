import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";
const api = axios.create({ baseURL: API_URL, timeout: 20000 });

export async function searchFlights({ origin, destination, departureDate, returnDate, adults }) {
  const { data } = await api.get("/api/booking/flights", {
    params: { origin, destination, departureDate, returnDate, adults },
  });
  return data.flights;
}

// Returns { place: { name, country }, hotels: [...] }
export async function searchHotels({ city, checkInDate, checkOutDate, guests, rooms }) {
  const { data } = await api.get("/api/booking/hotels", {
    params: { city, checkInDate, checkOutDate, guests, rooms },
  });
  return data;
}
