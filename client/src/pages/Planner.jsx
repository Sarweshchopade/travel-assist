import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Compass, MapPin, Wallet, Users, Utensils, Gauge, Sparkles } from "lucide-react";
import { useTrip } from "../context/TripContext";

const TRAVEL_TYPES = ["Family", "Solo", "Couple", "Friends group", "Business", "Senior citizens"];
const PACE_OPTIONS = ["Relaxed", "Balanced", "Packed"];

export default function Planner() {
  const navigate = useNavigate();
  const { status } = useTrip();
  const [form, setForm] = useState({
    destination: "Jaipur, India",
    days: 4,
    budget: 25000,
    currency: "INR",
    travelers: "2 adults, 2 seniors",
    travelType: "Family",
    interests: "History, forts, local markets",
    foodPreference: "Vegetarian",
    pace: "Balanced",
  });
  const [formError, setFormError] = useState(null);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!form.destination || !form.days || !form.budget) {
      setFormError("Destination, days and budget are required.");
      return;
    }
    navigate("/generating", { state: { form } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="flex items-center gap-2 mb-6 justify-center">
          <Compass size={20} className="text-marigold" />
          <span className="font-display text-lg">Yatra AI</span>
        </div>

        <div className="card-glass rounded-3xl p-6 md:p-10">
          <p className="uppercase tracking-[0.2em] text-xs text-teal font-semibold mb-2 text-center">
            Tell us about your trip
          </p>
          <h1 className="font-display text-3xl text-paper text-center mb-8">
            Where to, and what's the plan?
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Destination" icon={MapPin}>
              <input
                value={form.destination}
                onChange={update("destination")}
                placeholder="e.g. Jaipur, India"
                className="input"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Duration (days)" icon={Gauge}>
                <input
                  type="number"
                  min={1}
                  max={21}
                  value={form.days}
                  onChange={update("days")}
                  className="input"
                />
              </Field>
              <Field label="Total budget (₹)" icon={Wallet}>
                <input
                  type="number"
                  min={1000}
                  value={form.budget}
                  onChange={update("budget")}
                  className="input"
                />
              </Field>
            </div>

            <Field label="Travelers" icon={Users}>
              <input
                value={form.travelers}
                onChange={update("travelers")}
                placeholder="e.g. 2 adults, 2 seniors"
                className="input"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Travel type">
                <select value={form.travelType} onChange={update("travelType")} className="input">
                  {TRAVEL_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Pace">
                <select value={form.pace} onChange={update("pace")} className="input">
                  {PACE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Interests" icon={Sparkles}>
              <input
                value={form.interests}
                onChange={update("interests")}
                placeholder="e.g. History, forts, local markets"
                className="input"
              />
            </Field>

            <Field label="Food preference" icon={Utensils}>
              <input
                value={form.foodPreference}
                onChange={update("foodPreference")}
                placeholder="e.g. Vegetarian"
                className="input"
              />
            </Field>

            {formError && <p className="text-terracotta text-sm">{formError}</p>}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-marigold text-ink font-semibold py-3.5 rounded-full hover:bg-marigold-soft transition-colors disabled:opacity-60"
            >
              Generate my trip
            </button>
          </form>
        </div>
      </motion.div>

      <style>{`
        .input {
          width: 100%;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          color: var(--color-paper);
          border-radius: 0.75rem;
          padding: 0.7rem 0.9rem;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus {
          border-color: var(--color-marigold);
        }
      `}</style>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-mist mb-1.5">
        {Icon && <Icon size={13} />}
        {label}
      </span>
      {children}
    </label>
  );
}
