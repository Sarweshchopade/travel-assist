import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Map as MapIcon, MapPin, Shuffle } from "lucide-react";
import { useTrip } from "../../context/TripContext";
import { Panel, EmptyState } from "../../components/Panel";

export default function MapRoute() {
  const { plan } = useTrip();
  const [optimized, setOptimized] = useState(false);

  const stops = plan?.route || [];

  const embedUrl = useMemo(() => {
    if (!stops.length) return null;
    const lats = stops.map((s) => s.lat);
    const lngs = stops.map((s) => s.lng);
    const pad = 0.02;
    const minLat = Math.min(...lats) - pad;
    const maxLat = Math.max(...lats) + pad;
    const minLng = Math.min(...lngs) - pad;
    const maxLng = Math.max(...lngs) + pad;
    const center = stops[0];
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${center.lat}%2C${center.lng}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  if (!stops.length) {
    return (
      <EmptyState
        icon={MapIcon}
        title="No route available"
        description="The Planner Agent didn't return route coordinates for this trip."
      />
    );
  }

  return (
    <div className="space-y-5">
      <Panel title="Route map" icon={MapIcon}>
        <div className="rounded-xl overflow-hidden border border-border h-80">
          <iframe
            title="Trip route map"
            src={embedUrl}
            className="w-full h-full"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>
      </Panel>

      <Panel
        title="Stops"
        delay={0.1}
        className=""
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-mist">Planner + Maps Agent generated order</p>
          <button
            onClick={() => setOptimized((o) => !o)}
            className="flex items-center gap-1.5 text-xs bg-surface-2 border border-border rounded-full px-3 py-1.5 text-mist hover:text-marigold hover:border-marigold transition-colors"
          >
            <Shuffle size={13} />
            {optimized ? "Original order" : "Optimize route"}
          </button>
        </div>
        <div className="space-y-2.5">
          {(optimized ? [...stops].reverse() : stops).map((stop, i) => (
            <motion.div
              key={stop.name + i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-xl bg-surface-2/60 border border-border px-4 py-3"
            >
              <span className="w-7 h-7 rounded-full bg-marigold/15 text-marigold text-xs font-semibold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <MapPin size={15} className="text-teal shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-paper truncate">{stop.name}</p>
                <p className="text-xs text-mist">{stop.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
