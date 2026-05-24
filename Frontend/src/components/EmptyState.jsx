import { motion } from "framer-motion";

export default function EmptyState({ title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="section-shell flex min-h-[240px] flex-col items-center justify-center text-center"
    >
      <div className="mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-accent/30 to-primary/20 blur-sm" />
      <h3 className="font-display text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-300">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </motion.div>
  );
}
