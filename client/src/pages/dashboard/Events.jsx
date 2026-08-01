import { motion } from "framer-motion";
import { PartyPopper, MapPin, CalendarClock } from "lucide-react";
import { useTrip } from "../../context/TripContext";
import { Panel } from "../../components/Panel";

export default function Events() {
  const { plan } = useTrip();
  if (!plan?.events) return null;

  return (
    <div className="space-y-5">
      <Panel title="Nearby events & markets" icon={PartyPopper}>
        <p className="text-sm text-mist">Found by the Event Agent for your travel dates.</p>
      </Panel>

      <div className="grid md:grid-cols-3 gap-5">
        {plan.events.map((ev, i) => (
          <motion.div
            key={ev.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-glass rounded-2xl p-5 flex flex-col gap-3"
          >
            <div className="w-11 h-11 rounded-xl bg-terracotta/20 text-terracotta flex items-center justify-center">
              <PartyPopper size={19} />
            </div>
            <p className="font-display text-lg text-paper">{ev.name}</p>
            <div className="flex items-center gap-2 text-xs text-mist">
              <CalendarClock size={13} /> {ev.date}
            </div>
            <div className="flex items-center gap-2 text-xs text-mist">
              <MapPin size={13} /> {ev.location}
            </div>
            <p className="text-sm text-mist">{ev.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
