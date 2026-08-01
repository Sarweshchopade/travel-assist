import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Wallet,
  CloudSun,
  PartyPopper,
  ShieldCheck,
  Map,
  MessageCircle,
  Home,
  User,
} from "lucide-react";
import { useTrip } from "../context/TripContext";

const TILES = [
  { icon: CalendarDays, label: "Itinerary", color: "#e8a33d" },
  { icon: Wallet, label: "Budget", color: "#c1654a" },
  { icon: CloudSun, label: "Weather", color: "#7fb2f0" },
  { icon: PartyPopper, label: "Events", color: "#a78bfa" },
  { icon: ShieldCheck, label: "Safety", color: "#21b39a" },
  { icon: Map, label: "Map", color: "#e8a33d" },
];

export default function MobilePreview() {
  const { plan, tripInput } = useTrip();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 gap-8">
      <Link to={plan ? "/dashboard" : "/"} className="self-start flex items-center gap-2 text-mist hover:text-paper text-sm">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="text-center max-w-md">
        <p className="uppercase tracking-[0.2em] text-xs text-teal font-semibold mb-2">
          Same AI, in your pocket
        </p>
        <h1 className="font-display text-3xl text-paper mb-2">Mobile app preview</h1>
        <p className="text-mist text-sm">
          Yatra AI's dashboard adapts to a phone-first layout, so travelers get
          live updates on the go.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[300px] rounded-[2.5rem] border-4 border-surface-2 bg-ink-2 shadow-2xl p-3"
      >
        <div className="w-24 h-5 bg-ink rounded-full mx-auto mb-3" />
        <div className="rounded-[1.75rem] overflow-hidden bg-ink border border-border">
          <div className="bg-gradient-to-br from-marigold to-terracotta px-5 py-5">
            <p className="text-ink/70 text-xs font-semibold">Hi, Traveler 👋</p>
            <p className="text-ink font-display text-lg leading-tight mt-1">
              Your {tripInput?.destination || "Jaipur"} trip is ready
            </p>
          </div>

          <div className="p-4 grid grid-cols-3 gap-3">
            {TILES.map((t) => (
              <div key={t.label} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: `${t.color}22`, color: t.color }}
                >
                  <t.icon size={18} />
                </div>
                <span className="text-[10px] text-mist">{t.label}</span>
              </div>
            ))}
          </div>

          <div className="px-4 pb-4">
            <div className="rounded-2xl overflow-hidden border border-border h-28 bg-surface-2 flex items-center justify-center">
              <span className="text-mist text-xs">Day 1 · Trip preview</span>
            </div>
          </div>

          <div className="flex items-center justify-around border-t border-border py-3">
            <Home size={16} className="text-marigold" />
            <CalendarDays size={16} className="text-mist" />
            <MessageCircle size={16} className="text-mist" />
            <User size={16} className="text-mist" />
          </div>
        </div>
      </motion.div>

      {!plan && (
        <Link
          to="/plan"
          className="text-sm bg-marigold text-ink font-semibold px-5 py-2.5 rounded-full"
        >
          Plan a trip to see it live
        </Link>
      )}
    </div>
  );
}
