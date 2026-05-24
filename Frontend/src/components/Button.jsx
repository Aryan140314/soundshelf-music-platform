import { LoaderIcon } from "./Loader";
import { cn } from "../utils/cn";

const VARIANTS = {
  primary:
    "bg-gradient-to-r from-primary to-accent text-slate-950 shadow-glow hover:brightness-110",
  secondary: "bg-white/10 text-white hover:bg-white/15",
  ghost: "bg-transparent text-slate-300 hover:bg-white/8 hover:text-white",
  danger: "bg-danger/90 text-white hover:bg-danger",
};

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  ...props
}) {
  const sizes = {
    sm: "h-10 px-4 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200",
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderIcon /> : null}
      <span>{children}</span>
    </button>
  );
}
