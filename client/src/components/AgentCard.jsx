import { motion } from "framer-motion";

export default function AgentCard({ icon: Icon, name, description, color, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="card-glass rounded-2xl p-5 flex flex-col gap-3"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: `${color}22`, color }}
      >
        <Icon size={20} strokeWidth={2} />
      </div>
      <div>
        <h3 className="font-display text-lg text-paper">{name}</h3>
        <p className="text-sm text-mist mt-1 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
