import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  BedDouble,
  CloudSun,
  Wallet,
  Landmark,
  ShieldCheck,
  Languages,
  PartyPopper,
  AlertTriangle,
} from "lucide-react";
import { useTrip } from "../context/TripContext";

const STEPS = [
  { icon: CalendarDays, label: "Planner Agent is building your itinerary" },
  { icon: BedDouble, label: "Booking Agent is finding hotels" },
  { icon: CloudSun, label: "Weather Agent is checking the forecast" },
  { icon: Wallet, label: "Budget Agent is allocating your spend" },
  { icon: Landmark, label: "Culture Agent is gathering local insights" },
  { icon: ShieldCheck, label: "Safety Agent is preparing emergency info" },
  { icon: Languages, label: "Language Agent is prepping key phrases" },
  { icon: PartyPopper, label: "Event Agent is scanning local happenings" },
];

export default function Generating() {
  const location = useLocation();
  const navigate = useNavigate();
  const { createTrip, status, error } = useTrip();
  const [stepIndex, setStepIndex] = useState(0);
  const startedRef = useRef(false);

  const form = location.state?.form;

  useEffect(() => {
    if (!form) {
      navigate("/plan", { replace: true });
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    createTrip(form)
      .then(() => navigate("/dashboard", { replace: true }))
      .catch(() => {
        /* error surfaced via context state below */
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i < STEPS.length - 1 ? i + 1 : i));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-marigold to-terracotta mb-8 flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 rounded-lg bg-ink"
        />
      </motion.div>

      <h1 className="font-display text-2xl md:text-3xl text-paper mb-2">
        {form ? `Planning your trip to ${form.destination}` : "Preparing your trip"}
      </h1>
      <p className="text-mist mb-10">Our AI agents are working together in real time.</p>

      <div className="w-full max-w-md space-y-3">
        <AnimatePresence mode="popLayout">
          {STEPS.slice(0, stepIndex + 1).map((step, i) => {
            const Icon = step.icon;
            const isCurrent = i === stepIndex && status === "loading";
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-left card-glass ${
                  isCurrent ? "border-marigold/60" : ""
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-marigold/15 text-marigold flex items-center justify-center shrink-0">
                  <Icon size={14} />
                </div>
                <span className="text-paper">{step.label}</span>
                {isCurrent && (
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="ml-auto w-2 h-2 rounded-full bg-marigold"
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 max-w-md card-glass border-terracotta/50 rounded-xl p-5 text-left"
        >
          <div className="flex items-center gap-2 text-terracotta font-semibold mb-1">
            <AlertTriangle size={16} />
            Couldn't generate your trip
          </div>
          <p className="text-sm text-mist">{error}</p>
          <p className="text-xs text-mist mt-2">
            Check that the backend server is running and that{" "}
            <code className="text-marigold">GEMINI_API_KEY</code> (or{" "}
            <code className="text-marigold">ANTHROPIC_API_KEY</code>) is set in{" "}
            <code className="text-marigold">server/.env</code>.
          </p>
          <button
            onClick={() => navigate("/plan")}
            className="mt-4 text-sm bg-marigold text-ink font-semibold px-4 py-2 rounded-full"
          >
            Back to planner
          </button>
        </motion.div>
      )}
    </div>
  );
}
