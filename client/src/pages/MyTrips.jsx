import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Trash2, CalendarDays, Wallet, ArrowLeft, Plane } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTrip } from "../context/TripContext";
import { listTrips, getTrip, deleteTrip } from "../api/trips";
import { EmptyState } from "../components/Panel";

export default function MyTrips() {
  const { token, user } = useAuth();
  const { loadSavedTrip } = useTrip();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    listTrips(token)
      .then((data) => {
        setTrips(data);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err?.response?.data?.error || "Couldn't load your trips");
        setStatus("error");
      });
  }, [token]);

  const handleOpen = async (id) => {
    const trip = await getTrip(token, id);
    loadSavedTrip(trip);
    navigate("/dashboard");
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    await deleteTrip(token, id);
    setTrips((t) => t.filter((trip) => trip.id !== id));
  };

  return (
    <div className="min-h-screen px-6 md:px-10 py-10 max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-mist hover:text-paper text-sm mb-6">
        <ArrowLeft size={16} /> Back home
      </Link>

      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="uppercase tracking-[0.2em] text-xs text-teal font-semibold mb-1">
            {user?.name ? `${user.name}'s trips` : "Your trips"}
          </p>
          <h1 className="font-display text-3xl text-paper">Saved journeys</h1>
        </div>
        <Link
          to="/plan"
          className="inline-flex items-center gap-2 bg-marigold text-ink font-semibold px-5 py-2.5 rounded-full text-sm"
        >
          <Plane size={15} />
          Plan a new trip
        </Link>
      </div>

      {status === "loading" && <p className="text-mist text-sm">Loading your trips…</p>}
      {status === "error" && <p className="text-terracotta text-sm">{error}</p>}

      {status === "ready" && trips.length === 0 && (
        <EmptyState
          icon={MapPin}
          title="No saved trips yet"
          description="Plan a trip and hit Save on the overview page to see it here."
        />
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {trips.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleOpen(trip.id)}
              className="card-glass rounded-2xl p-5 cursor-pointer hover:-translate-y-1 transition-transform relative"
            >
              <button
                onClick={(e) => handleDelete(trip.id, e)}
                className="absolute top-4 right-4 text-mist hover:text-terracotta transition-colors"
                aria-label="Delete trip"
              >
                <Trash2 size={15} />
              </button>
              <div className="w-10 h-10 rounded-xl bg-marigold/15 text-marigold flex items-center justify-center mb-3">
                <MapPin size={18} />
              </div>
              <p className="font-display text-lg text-paper truncate pr-6">{trip.destination}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-mist">
                <span className="flex items-center gap-1">
                  <CalendarDays size={12} /> {trip.days} days
                </span>
                <span className="flex items-center gap-1">
                  <Wallet size={12} /> {trip.currency} {Number(trip.budget).toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-[11px] text-mist mt-3">
                Saved {new Date(trip.created_at).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
