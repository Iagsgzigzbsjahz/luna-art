import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "danger" | "blue";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-gold text-ink hover:bg-gold-light",
  outline: "border border-beige/25 text-beige hover:border-gold hover:text-gold",
  ghost: "text-beige/80 hover:bg-white/5 hover:text-beige",
  danger: "border border-red-400/25 bg-red-500/10 text-red-300 hover:bg-red-500/20",
  blue: "bg-azure/15 text-azure hover:bg-azure/25",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-8 text-base",
  icon: "h-9 w-9",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={buttonStyles({ variant, size, className })} {...props} />
  ),
);
Button.displayName = "Button";
