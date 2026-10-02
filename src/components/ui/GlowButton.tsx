"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

interface GlowButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "green" | "pink" | "gold" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
}

const variantClasses = {
  green: "btn-ritual",
  pink: "btn-ritual-pink",
  gold: "btn-ritual-gold",
  ghost: "btn-ritual-ghost",
  danger: "btn-ritual-danger",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function GlowButton({
  children,
  variant = "green",
  size = "md",
  loading = false,
  icon,
  disabled,
  className = "",
  ...props
}: GlowButtonProps) {
  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`${variantClasses[variant]} ${sizeClasses[size]} inline-flex items-center justify-center gap-2 ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="text-base">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}
