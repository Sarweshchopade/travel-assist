import { motion } from "framer-motion";
import { Landmark, UtensilsCrossed } from "lucide-react";
import { useTrip } from "../../context/TripContext";
import { Panel } from "../../components/Panel";

export default function Culture() {
  const { plan } = useTrip();
  if (!plan?.culture) return null;
  const { about, etiquette, mustTryFood } = plan.culture;

  return (
    <div className="space-y-5">
      <Panel title={`About ${plan.destination}`} icon={Landmark}>
        <p className="text-sm text-mist leading-relaxed">{about}</p>
      </Panel>

      <Panel title="Etiquette to keep in mind" delay={0.1}>
        <div className="grid sm:grid-cols-2 gap-3">
          {etiquette?.map((e, i) => (
            <motion.div
              key={e}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl bg-surface-2/60 border border-border p-4 text-sm text-paper"
            >
              {e}
            </motion.div>
          ))}
        </div>
      </Panel>

      <Panel title="Must-try local food" icon={UtensilsCrossed} delay={0.15}>
        <div className="grid sm:grid-cols-2 gap-4">
          {mustTryFood?.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-terracotta/20 text-terracotta flex items-center justify-center shrink-0 font-display">
                {f.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-paper">{f.name}</p>
                <p className="text-xs text-mist mt-0.5">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
