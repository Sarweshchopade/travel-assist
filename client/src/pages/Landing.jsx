import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  BedDouble,
  CloudSun,
  Wallet,
  Landmark,
  ShieldCheck,
  Languages,
  PartyPopper,
  CheckCircle2,
} from "lucide-react";
import RouteLine from "../components/RouteLine";
import AgentCard from "../components/AgentCard";

const AGENTS = [
  { icon: CalendarDays, name: "Planner Agent", color: "#e8a33d", description: "Builds a day-wise itinerary from preferences, time, and distance." },
  { icon: BedDouble, name: "Booking Agent", color: "#21b39a", description: "Finds hotels, flights, trains and local transport within budget." },
  { icon: CloudSun, name: "Weather Agent", color: "#7fb2f0", description: "Monitors live forecasts and adjusts the itinerary on the fly." },
  { icon: Wallet, name: "Budget Agent", color: "#c1654a", description: "Tracks spend in real time and predicts overspending early." },
  { icon: Landmark, name: "Culture Agent", color: "#e8a33d", description: "Explains etiquette, food and historical facts for the destination." },
  { icon: ShieldCheck, name: "Safety Agent", color: "#21b39a", description: "Surfaces emergency contacts, scam alerts and weather warnings." },
  { icon: Languages, name: "Language Agent", color: "#7fb2f0", description: "Translates speech, signs and menus in multiple languages." },
  { icon: PartyPopper, name: "Event Agent", color: "#c1654a", description: "Finds festivals, concerts and local markets during your dates." },
];

const BENEFITS = [
  "Hyper-personalized travel experience",
  "Saves time in planning & booking",
  "Real-time updates & smart alerts",
  "Budget-friendly with smart suggestions",
  "Cultural respect & local experiences",
  "Safe, secure & reliable companion",
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 md:px-10 pt-10 pb-20 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-marigold to-terracotta" />
            <span className="font-display text-lg">Yatra AI</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/my-trips" className="text-mist hover:text-paper transition-colors">
              My trips
            </Link>
            <Link to="/login" className="text-mist hover:text-paper transition-colors">
              Log in
            </Link>
            <Link
              to="/signup"
              className="bg-surface-2 border border-border text-paper px-4 py-2 rounded-full hover:border-marigold transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="uppercase tracking-[0.2em] text-xs text-teal font-semibold mb-4"
            >
              Multi-agent generative AI
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-6xl leading-[1.05] text-paper"
            >
              Your journey,
              <br />
              <span className="text-gradient-marigold">planned by a team of AI agents.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-mist text-lg mt-6 max-w-lg"
            >
              Tell Yatra AI where you're going, your budget, and what you love.
              Eight specialist agents plan the itinerary, book smart, track
              spend, and stay with you before, during, and after the trip.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/plan"
                className="inline-flex items-center gap-2 bg-marigold text-ink font-semibold px-6 py-3 rounded-full hover:bg-marigold-soft transition-colors"
              >
                Plan your trip
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/mobile-preview"
                className="text-mist hover:text-paper text-sm underline underline-offset-4"
              >
                See the mobile app
              </Link>
            </motion.div>
            <RouteLine width={420} height={40} className="mt-8 opacity-80" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-glass rounded-3xl p-6"
          >
            <p className="text-xs uppercase tracking-wide text-mist mb-2">User input</p>
            <p className="font-display text-lg text-paper leading-snug">
              "I am planning a 4-day trip to Jaipur with my parents. Budget
              ₹25,000. We like history and vegetarian food."
            </p>
            <div className="mt-5 space-y-2.5">
              {[
                "Personalized itinerary",
                "Smart bookings",
                "Real-time updates",
                "Cultural insights",
                "Budget tracking",
                "Safety first",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-mist">
                  <CheckCircle2 size={16} className="text-teal shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Agent architecture */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="uppercase tracking-[0.2em] text-xs text-teal font-semibold mb-3">
            Multi-agent architecture
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-paper">
            Eight agents, one seamless trip
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AGENTS.map((agent, i) => (
            <AgentCard key={agent.name} index={i} {...agent} />
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="card-glass rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl text-paper mb-4">
              Plan smarter. Travel better.
              <br />
              Experience more.
            </h2>
            <p className="text-mist mb-6">
              Built for families, solo travelers, group tours, business trips,
              and senior citizens alike — Yatra AI adapts the plan to who's
              actually going.
            </p>
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 bg-teal text-ink font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Start planning
              <ArrowRight size={18} />
            </Link>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-paper">
                <CheckCircle2 size={16} className="text-marigold mt-0.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="px-6 md:px-10 py-8 text-center text-mist text-sm border-t border-border">
        Yatra AI — your journey, perfectly planned.
      </footer>
    </div>
  );
}
