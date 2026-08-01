import { motion } from "framer-motion";
import { useState } from "react";
import { BedDouble, Star, BadgeCheck, Search, Globe2, AlertCircle } from "lucide-react";
import { useTrip } from "../../context/TripContext";
import { Panel } from "../../components/Panel";
import { searchHotels } from "../../api/booking";

function defaultDates() {
  const in7 = new Date();
  in7.setDate(in7.getDate() + 7);
  const in10 = new Date();
  in10.setDate(in10.getDate() + 10);
  return {
    checkInDate: in7.toISOString().slice(0, 10),
    checkOutDate: in10.toISOString().slice(0, 10),
  };
}

export default function Hotels() {
  const { plan } = useTrip();
  const [form, setForm] = useState({ city: plan?.destination || "", ...defaultDates() });
  const [liveResult, setLiveResult] = useState(null);
  const [liveStatus, setLiveStatus] = useState("idle"); // idle | loading | error
  const [liveError, setLiveError] = useState(null);

  if (!plan) return null;

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleLiveSearch = async (e) => {
    e.preventDefault();
    if (!form.city.trim() || !form.checkInDate || !form.checkOutDate) return;
    setLiveStatus("loading");
    setLiveError(null);
    try {
      const result = await searchHotels(form);
      setLiveResult(result);
      setLiveStatus("idle");
    } catch (err) {
      setLiveError(err?.response?.data?.error || null);
      setLiveStatus("error");
    }
  };

  return (
    <div className="space-y-5">
      <Panel title="Recommended hotels" icon={BedDouble}>
        <p className="text-sm text-mist">Curated by the Booking Agent to fit your budget and destination.</p>
      </Panel>

      <div className="grid md:grid-cols-3 gap-5">
        {plan.hotels?.map((hotel, i) => (
          <motion.div
            key={hotel.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-glass rounded-2xl p-5 flex flex-col gap-3 relative"
          >
            {hotel.recommended && (
              <span className="absolute top-4 right-4 flex items-center gap-1 text-[11px] bg-teal/15 text-teal px-2 py-1 rounded-full font-semibold">
                <BadgeCheck size={12} /> Best pick
              </span>
            )}
            <div className="w-11 h-11 rounded-xl bg-marigold/15 text-marigold flex items-center justify-center">
              <BedDouble size={19} />
            </div>
            <div>
              <p className="font-display text-lg text-paper">{hotel.name}</p>
              <p className="text-xs text-mist">{hotel.area}</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-marigold">
              <Star size={14} fill="currentColor" />
              {hotel.rating}
            </div>
            <p className="font-display text-2xl text-paper">
              ₹{Number(hotel.pricePerNight).toLocaleString("en-IN")}
              <span className="text-xs text-mist font-body"> / night</span>
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {hotel.amenities?.map((a) => (
                <span key={a} className="text-[11px] px-2 py-1 rounded-full bg-surface-2 text-mist border border-border">
                  {a}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <Panel title="Live hotel inventory" icon={Globe2} delay={0.1}>
        <p className="text-sm text-mist mb-4">
          Search real hotel inventory via Duffel Stays for any city and dates
          (free sandbox — sandbox pricing, real inventory structure).
        </p>
        <form onSubmit={handleLiveSearch} className="grid sm:grid-cols-4 gap-2 mb-4">
          <input
            value={form.city}
            onChange={update("city")}
            placeholder="City, e.g. Jaipur"
            className="input"
          />
          <input
            type="date"
            value={form.checkInDate}
            onChange={update("checkInDate")}
            className="input"
          />
          <input
            type="date"
            value={form.checkOutDate}
            onChange={update("checkOutDate")}
            className="input"
          />
          <button
            type="submit"
            disabled={liveStatus === "loading"}
            className="flex items-center justify-center gap-1.5 bg-teal text-ink font-semibold px-4 py-2 rounded-full text-sm disabled:opacity-60"
          >
            <Search size={14} />
            {liveStatus === "loading" ? "Searching…" : "Search"}
          </button>
        </form>

        {liveStatus === "error" && (
          <p className="flex items-center gap-1.5 text-terracotta text-sm">
            <AlertCircle size={14} />
            {liveError ||
              "Live search needs DUFFEL_API_KEY configured on the backend (free at app.duffel.com/join), or this city has no results."}
          </p>
        )}

        {liveResult && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {liveResult.hotels.map((h) => (
              <div key={h.id} className="rounded-xl bg-surface-2/60 border border-border p-4">
                <p className="text-sm font-semibold text-paper truncate">{h.name}</p>
                {h.rating && (
                  <p className="text-xs text-marigold flex items-center gap-1 mt-1">
                    <Star size={11} fill="currentColor" /> {h.rating}
                  </p>
                )}
                {h.cheapestPrice && (
                  <p className="text-sm text-paper mt-1">
                    {h.currency} {Number(h.cheapestPrice).toLocaleString("en-IN")}
                    <span className="text-xs text-mist"> / stay</span>
                  </p>
                )}
              </div>
            ))}
            {!liveResult.hotels.length && (
              <p className="text-sm text-mist">No live results for that city/dates.</p>
            )}
          </div>
        )}
      </Panel>

      <style>{`
        .input {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          color: var(--color-paper);
          border-radius: 9999px;
          padding: 0.6rem 1rem;
          font-size: 0.85rem;
          outline: none;
        }
        .input:focus { border-color: var(--color-marigold); }
      `}</style>
    </div>
  );
}
