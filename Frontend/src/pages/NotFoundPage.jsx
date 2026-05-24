import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel w-full max-w-xl rounded-[32px] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-primary">404</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-white">This page drifted off the track.</h1>
        <p className="mt-4 text-sm text-slate-300">
          The route you requested is not available in the current SoundShelf experience.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-semibold text-slate-950"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
