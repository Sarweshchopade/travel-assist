import { createContext, useContext, useState, useCallback } from "react";
import { generatePlan } from "../api/agents";
import { getDestinationWeather } from "../api/weather";

const TripContext = createContext(null);

const STORAGE_KEY = "ai-travel-assistant:trip";

function loadCached() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function TripProvider({ children }) {
  const cached = loadCached();
  const [tripInput, setTripInput] = useState(cached?.tripInput || null);
  const [plan, setPlan] = useState(cached?.plan || null);
  const [weather, setWeather] = useState(cached?.weather || null);
  const [status, setStatus] = useState("idle"); // idle | loading | error | ready
  const [error, setError] = useState(null);

  const persist = (data) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore quota errors */
    }
  };

  const createTrip = useCallback(async (input) => {
    setStatus("loading");
    setError(null);
    setTripInput(input);
    try {
      const [planResult, weatherResult] = await Promise.allSettled([
        generatePlan(input),
        getDestinationWeather(input.destination, Math.min(Number(input.days) || 4, 7)),
      ]);

      if (planResult.status !== "fulfilled") {
        throw planResult.reason;
      }

      const newPlan = planResult.value;
      const newWeather =
        weatherResult.status === "fulfilled" ? weatherResult.value : null;

      setPlan(newPlan);
      setWeather(newWeather);
      setStatus("ready");
      persist({ tripInput: input, plan: newPlan, weather: newWeather });
      return newPlan;
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err.message || "Something went wrong");
      setStatus("error");
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setTripInput(null);
    setPlan(null);
    setWeather(null);
    setStatus("idle");
    setError(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const loadSavedTrip = useCallback((savedTrip) => {
    setTripInput(savedTrip.tripInput);
    setPlan(savedTrip.plan);
    setWeather(savedTrip.weather || null);
    setStatus("ready");
    setError(null);
    persist({ tripInput: savedTrip.tripInput, plan: savedTrip.plan, weather: savedTrip.weather });
  }, []);

  return (
    <TripContext.Provider
      value={{ tripInput, plan, weather, status, error, createTrip, reset, loadSavedTrip }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within TripProvider");
  return ctx;
}
