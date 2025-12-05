import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

const NeonButton = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: NeonButtonProps) => {
  const baseStyles =
    "font-semibold tracking-wide relative overflow-hidden transition-all duration-300 rounded-xl flex items-center justify-center shadow-lg";

  const variants = {
    primary:
      "bg-gradient-to-r from-sky-blue to-sky-light text-white hover:from-sky-light hover:to-sky-blue hover:shadow-xl hover:shadow-sky-blue/40",
    secondary:
      "bg-white/90 backdrop-blur-sm border-2 border-sky-blue text-sky-blue hover:bg-sky-blue hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...(props as HTMLMotionProps<"button">)}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
        {children}
      </span>
    </motion.button>
  );
};

export default NeonButton;
