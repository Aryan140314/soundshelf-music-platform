export function LoaderIcon() {
  return (
    <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
  );
}

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 text-slate-300">
      <span className="inline-flex h-10 w-10 animate-spin rounded-full border-[3px] border-primary/35 border-r-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
