import { cn } from "../utils/cn";

export default function Input({
  label,
  error,
  icon: Icon,
  className,
  inputClassName,
  ...props
}) {
  return (
    <label className={cn("block space-y-2", className)}>
      {label ? <span className="text-sm font-medium text-slate-200">{label}</span> : null}
      <div
        className={cn(
          "flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4",
          "transition focus-within:border-primary/60 focus-within:bg-white/8"
        )}
      >
        {Icon ? <Icon className="text-slate-400" /> : null}
        <input
          className={cn(
            "h-full w-full bg-transparent text-sm text-white placeholder:text-slate-500",
            inputClassName
          )}
          {...props}
        />
      </div>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </label>
  );
}
