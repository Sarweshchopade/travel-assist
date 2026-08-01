import { motion } from "framer-motion";

/**
 * Signature motif: a hand-drawn travel route that traces itself in,
 * with a marker "traveling" along the path. Used on the landing hero,
 * the generating screen, and as section dividers.
 */
export default function RouteLine({
  width = 600,
  height = 60,
  className = "",
  color = "var(--color-marigold)",
  duration = 2.2,
  showMarker = true,
}) {
  const path = `M2 ${height / 2} C ${width * 0.2} ${height * 0.1}, ${
    width * 0.35
  } ${height * 0.9}, ${width * 0.5} ${height / 2} S ${width * 0.8} ${
    height * 0.1
  }, ${width - 2} ${height / 2}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      width="100%"
      height={height}
      fill="none"
      preserveAspectRatio="none"
    >
      <motion.path
        d={path}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 8"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration, ease: "easeInOut" }}
      />
      {showMarker && (
        <motion.circle
          r="5"
          fill={color}
          initial={{ offsetDistance: "0%", opacity: 0 }}
          whileInView={{ offsetDistance: "100%", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration, ease: "easeInOut" }}
          style={{ offsetPath: `path("${path}")` }}
        />
      )}
    </svg>
  );
}
