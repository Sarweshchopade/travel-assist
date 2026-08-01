import { motion } from "framer-motion";

export function Panel({ title, icon: Icon, iconColor = "var(--color-marigold)", children, className = "", delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`card-glass rounded-2xl p-5 md:p-6 ${className}`}
    >
      {title && (
        <div className="flex items-center gap-2.5 mb-4">
          {Icon && (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${iconColor}22`, color: iconColor }}
            >
              <Icon size={16} />
            </div>
          )}
          <h2 className="font-display text-lg text-paper">{title}</h2>
        </div>
      )}
      {children}
    </motion.section>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 card-glass rounded-2xl">
      {Icon && <Icon size={32} className="text-mist mb-3" />}
      <h3 className="font-display text-lg text-paper">{title}</h3>
      {description && <p className="text-sm text-mist mt-1 max-w-sm">{description}</p>}
    </div>
  );
}
