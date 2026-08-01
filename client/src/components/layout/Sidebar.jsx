import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  Plane,
  CloudSun,
  Wallet,
  Landmark,
  PartyPopper,
  ShieldCheck,
  Languages,
  MessageCircle,
  Map,
  BarChart3,
  Smartphone,
  Compass,
  BookMarked,
} from "lucide-react";
import { useTrip } from "../../context/TripContext";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "itinerary", label: "Itinerary", icon: CalendarDays },
  { to: "hotels", label: "Hotels", icon: BedDouble },
  { to: "flights", label: "Flights", icon: Plane },
  { to: "weather", label: "Weather", icon: CloudSun },
  { to: "budget", label: "Budget", icon: Wallet },
  { to: "culture", label: "Culture", icon: Landmark },
  { to: "events", label: "Events", icon: PartyPopper },
  { to: "safety", label: "Safety", icon: ShieldCheck },
  { to: "language", label: "Language", icon: Languages },
  { to: "chat", label: "AI Chat", icon: MessageCircle },
  { to: "map", label: "Map & Route", icon: Map },
  { to: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar({ onNavigate }) {
  const { tripInput } = useTrip();
  const { user } = useAuth();

  return (
    <aside className="h-full w-64 shrink-0 border-r border-border bg-ink-2/60 backdrop-blur-md flex flex-col">
      <div className="px-5 py-6 flex items-center gap-2 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-marigold to-terracotta flex items-center justify-center">
          <Compass size={18} className="text-ink" />
        </div>
        <div>
          <p className="font-display text-base leading-none text-paper">Yatra AI</p>
          <p className="text-[11px] text-mist mt-1">Travel Assistant</p>
        </div>
      </div>

      {tripInput && (
        <div className="mx-4 mt-4 mb-2 rounded-xl bg-surface/60 border border-border px-3 py-2.5">
          <p className="text-[11px] uppercase tracking-wide text-mist">Current trip</p>
          <p className="text-sm text-paper font-medium truncate">{tripInput.destination}</p>
          <p className="text-xs text-teal">{tripInput.days} days</p>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? "bg-marigold/15 text-marigold font-semibold"
                  : "text-mist hover:text-paper hover:bg-surface/70"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border space-y-1">
        <NavLink
          to="/mobile-preview"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-mist hover:text-paper hover:bg-surface/70 transition-colors"
        >
          <Smartphone size={17} />
          Mobile App Preview
        </NavLink>
        <NavLink
          to="/my-trips"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-mist hover:text-paper hover:bg-surface/70 transition-colors"
        >
          <BookMarked size={17} />
          {user ? "My Trips" : "Log in to save trips"}
        </NavLink>
      </div>
    </aside>
  );
}
