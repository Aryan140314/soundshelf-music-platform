export default function SkeletonCard({ compact = false }) {
  return (
    <div className="glass-panel animate-pulse rounded-[24px] p-4">
      <div className={`rounded-2xl bg-white/8 ${compact ? "h-32" : "h-44"}`} />
      <div className="mt-4 h-4 w-3/4 rounded-full bg-white/8" />
      <div className="mt-2 h-3 w-1/2 rounded-full bg-white/6" />
    </div>
  );
}
