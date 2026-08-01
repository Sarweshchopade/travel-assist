import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Search, AlertCircle, ArrowRight, Clock } from "lucide-react";
import { Panel } from "../../components/Panel";
import { searchFlights } from "../../api/booking";

export default function Flights() {
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    adults: 1,
  });
  const [flights, setFlights] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | error

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!form.origin || !form.destination || !form.departureDate) return;
    setStatus("loading");
    try {
      const results = await searchFlights({
        origin: form.origin.toUpperCase(),
        destination: form.destination.toUpperCase(),
        departureDate: form.departureDate,
        adults: form.adults,
      });
      setFlights(results);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-5">
      <Panel title="Search real flights" icon={Plane}>
        <p className="text-sm text-mist mb-4">
          Powered by Duffel's live flight search (free test environment, 300+
          airlines). Use IATA airport codes, e.g.{" "}
          <code className="text-marigold">DEL</code> (Delhi),{" "}
          <code className="text-marigold">JAI</code> (Jaipur),{" "}
          <code className="text-marigold">BOM</code> (Mumbai).
        </p>
        <form onSubmit={handleSearch} className="grid sm:grid-cols-4 gap-3">
          <input
            value={form.origin}
            onChange={update("origin")}
            placeholder="From (e.g. DEL)"
            maxLength={3}
            className="input uppercase"
            required
          />
          <input
            value={form.destination}
            onChange={update("destination")}
            placeholder="To (e.g. JAI)"
            maxLength={3}
            className="input uppercase"
            required
          />
          <input
            type="date"
            value={form.departureDate}
            onChange={update("departureDate")}
            className="input"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex items-center justify-center gap-1.5 bg-marigold text-ink font-semibold rounded-full text-sm disabled:opacity-60"
          >
            <Search size={14} />
            {status === "loading" ? "Searching…" : "Search"}
          </button>
        </form>

        {status === "error" && (
          <p className="flex items-center gap-1.5 text-terracotta text-sm mt-3">
            <AlertCircle size={14} />
            Flight search needs DUFFEL_API_KEY configured on the backend
            (free at app.duffel.com/join), or no flights matched that
            route/date.
          </p>
        )}
      </Panel>

      <AnimatePresence>
        {flights && (
          <Panel title={`${flights.length} results`} delay={0.05}>
            <div className="space-y-3">
              {flights.map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between gap-4 rounded-xl bg-surface-2/60 border border-border p-4 flex-wrap"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-marigold/15 text-marigold flex items-center justify-center shrink-0">
                      <Plane size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-paper">{f.airline} · {f.stops === 0 ? "Nonstop" : `${f.stops} stop`}</p>
                      <p className="text-xs text-mist flex items-center gap-1">
                        {f.departure.code} <ArrowRight size={11} /> {f.arrival.code}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-mist">
                    <Clock size={12} /> {f.duration.replace("PT", "").toLowerCase()}
                  </div>
                  <p className="font-display text-lg text-paper">
                    {f.currency} {Number(f.price).toLocaleString("en-IN")}
                  </p>
                </motion.div>
              ))}
              {!flights.length && <p className="text-sm text-mist">No flights found for that route.</p>}
            </div>
          </Panel>
        )}
      </AnimatePresence>

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
