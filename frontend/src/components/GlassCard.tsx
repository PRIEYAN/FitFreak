import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowEffect?: boolean;
}

const GlassCard = ({
  children,
  className = "",
  glowEffect = false,
}: GlassCardProps) => {
  return (
    <motion.div
      className={`glass-card p-8 relative overflow-hidden hover:shadow-xl hover:shadow-sky-blue/20 transition-all duration-300 ${
        glowEffect ? "ring-2 ring-sky-light/30" : ""
      } ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;
