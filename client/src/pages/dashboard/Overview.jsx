import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  CalendarDays,
  BedDouble,
  CloudSun,
  Wallet,
  ArrowUpRight,
  Sparkles,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { useTrip } from "../../context/TripContext";
import { useAuth } from "../../context/AuthContext";
import { Panel } from "../../components/Panel";
import { describeWeatherCode } from "../../api/weather";
import { saveTrip } from "../../api/trips";

export default function Overview() {
  const { plan, tripInput, weather } = useTrip();
  const { token } = useAuth();
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  if (!plan) return null;

  const handleSave = async () => {
    if (!token) return;
    setSaveState("saving");
    try {
      await saveTrip(token, { tripInput, plan, weather });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  const spent = plan.budget?.categories?.reduce((s, c) => s + Number(c.amount || 0), 0) || 0;
  const total = plan.budget?.total || tripInput?.budget || 0;
  const pct = total ? Math.min(100, Math.round((spent / total) * 100)) : 0;

  const currentWeather = weather?.forecast?.current;
  const wCode = currentWeather ? describeWeatherCode(currentWeather.weather_code) : null;

  return (
    <div className="space-y-6">
      <Panel className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-marigold/15 text-marigold flex items-center justify-center shrink-0">
          <Sparkles size={18} />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-mist mb-1">Concierge Agent</p>
          <p className="font-display text-lg text-paper leading-snug">{plan.welcomeMessage}</p>
        </div>
        {token ? (
          <button
            onClick={handleSave}
            disabled={saveState === "saving" || saveState === "saved"}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full shrink-0 transition-colors ${
              saveState === "saved"
                ? "bg-teal/15 text-teal"
                : "bg-surface-2 text-mist hover:text-marigold border border-border"
            }`}
          >
            {saveState === "saved" ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : "Save trip"}
          </button>
        ) : (
          <Link
            to="/login"
            className="text-xs text-mist hover:text-marigold shrink-0 border border-border rounded-full px-3 py-2"
          >
            Log in to save
          </Link>
        )}
      </Panel>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        <SummaryCard
          to="itinerary"
          icon={CalendarDays}
          color="#e8a33d"
          label="Itinerary"
          value={`${plan.days} days`}
          sub={plan.itinerary?.[0]?.title || ""}
        />
        <SummaryCard
          to="hotels"
          icon={BedDouble}
          color="#21b39a"
          label="Top hotel pick"
          value={plan.hotels?.[0]?.name || "—"}
          sub={plan.hotels?.[0] ? `₹${plan.hotels[0].pricePerNight}/night` : ""}
        />
        <SummaryCard
          to="weather"
          icon={CloudSun}
          color="#7fb2f0"
          label="Right now"
          value={currentWeather ? `${Math.round(currentWeather.temperature_2m)}°C` : "—"}
          sub={wCode?.label || "Live via Open-Meteo"}
        />
        <SummaryCard
          to="budget"
          icon={Wallet}
          color="#c1654a"
          label="Budget used"
          value={`${pct}%`}
          sub={`₹${spent.toLocaleString("en-IN")} of ₹${Number(total).toLocaleString("en-IN")}`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Panel title="Trip at a glance" icon={CalendarDays} delay={0.1}>
          <ul className="space-y-3">
            {plan.itinerary?.map((day) => (
              <li key={day.day} className="flex gap-3">
                <span className="text-marigold font-display text-sm w-14 shrink-0">
                  Day {day.day}
                </span>
                <div>
                  <p className="text-paper text-sm font-medium">{day.title}</p>
                  <p className="text-mist text-xs mt-0.5">{day.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="About your destination" icon={Sparkles} delay={0.15}>
          <p className="text-sm text-mist leading-relaxed">{plan.culture?.about}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {plan.culture?.etiquette?.map((e) => (
              <span
                key={e}
                className="text-xs px-3 py-1.5 rounded-full bg-surface-2 text-mist border border-border"
              >
                {e}
              </span>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function SummaryCard({ to, icon: Icon, color, label, value, sub }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        to={to}
        className="card-glass rounded-2xl p-5 flex flex-col gap-3 hover:-translate-y-1 transition-transform block h-full"
      >
        <div className="flex items-center justify-between">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: `${color}22`, color }}
          >
            <Icon size={17} />
          </div>
          <ArrowUpRight size={15} className="text-mist" />
        </div>
        <div>
          <p className="text-xs text-mist">{label}</p>
          <p className="font-display text-xl text-paper truncate">{value}</p>
          <p className="text-xs text-mist truncate mt-0.5">{sub}</p>
        </div>
      </Link>
    </motion.div>
  );
}
