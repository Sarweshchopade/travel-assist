import { useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PageTransition from "../PageTransition";
import { useTrip } from "../../context/TripContext";

const TITLES = {
  "/dashboard": "Overview",
  "/dashboard/itinerary": "Itinerary",
  "/dashboard/hotels": "Hotel Recommendations",
  "/dashboard/flights": "Flight Search",
  "/dashboard/weather": "Weather Forecast",
  "/dashboard/budget": "Budget Tracker",
  "/dashboard/culture": "Cultural Insights",
  "/dashboard/events": "Nearby Events",
  "/dashboard/safety": "Safety & Assistance",
  "/dashboard/language": "Language Assistant",
  "/dashboard/chat": "AI Chat Assistant",
  "/dashboard/map": "Map & Route",
  "/dashboard/analytics": "Analytics",
};

export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const { plan, status } = useTrip();

  if (!plan && status !== "loading") {
    return <Navigate to="/plan" replace />;
  }

  const title = TITLES[location.pathname] || "Dashboard";

  return (
    <div className="h-screen flex bg-ink overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              className="relative z-50 h-full"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <Sidebar onNavigate={() => setMobileNavOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
