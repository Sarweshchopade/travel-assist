import { motion } from "framer-motion";
import { ShieldCheck, Phone, Hospital, AlertTriangle } from "lucide-react";
import { useTrip } from "../../context/TripContext";
import { Panel } from "../../components/Panel";

export default function Safety() {
  const { plan } = useTrip();
  if (!plan?.safety) return null;
  const { emergencyNumber, nearestHospitalType, touristPoliceNumber, tips } = plan.safety;

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-4">
        <ContactCard icon={Phone} label="Emergency" value={emergencyNumber} color="#c1654a" />
        <ContactCard icon={Hospital} label="Nearest hospital type" value={nearestHospitalType} color="#21b39a" />
        <ContactCard icon={ShieldCheck} label="Tourist police" value={touristPoliceNumber} color="#e8a33d" />
      </div>

      <Panel title="Safety Agent tips" icon={AlertTriangle} delay={0.1}>
        <div className="space-y-2.5">
          {tips?.map((tip, i) => (
            <motion.div
              key={tip}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-3 rounded-xl bg-surface-2/60 border border-border p-4"
            >
              <AlertTriangle size={16} className="text-marigold mt-0.5 shrink-0" />
              <p className="text-sm text-paper">{tip}</p>
            </motion.div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ContactCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card-glass rounded-2xl p-5 flex items-center gap-3">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}22`, color }}
      >
        <Icon size={19} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-mist">{label}</p>
        <p className="font-display text-lg text-paper truncate">{value}</p>
      </div>
    </div>
  );
}
