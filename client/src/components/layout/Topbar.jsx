import { Menu, RotateCcw, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../../context/TripContext";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ title, onMenuClick }) {
  const navigate = useNavigate();
  const { reset } = useTrip();
  const { user, logout } = useAuth();

  return (
    <header className="h-16 shrink-0 border-b border-border bg-ink-2/50 backdrop-blur-md flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-mist"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="font-display text-xl text-paper">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-mist">
            {user.name}
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-mist hover:text-terracotta transition-colors ml-1"
              aria-label="Log out"
            >
              <LogOut size={13} />
            </button>
          </span>
        )}
        <button
          onClick={() => {
            reset();
            navigate("/plan");
          }}
          className="flex items-center gap-2 text-xs md:text-sm text-mist hover:text-marigold transition-colors border border-border rounded-full px-3 py-1.5"
        >
          <RotateCcw size={14} />
          Plan a new trip
        </button>
      </div>
    </header>
  );
}
