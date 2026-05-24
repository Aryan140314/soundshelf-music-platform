import { FiBell, FiLogOut, FiSearch, FiUser } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { initialsFromName } from "../utils/formatters";
import Button from "./Button";

export default function Navbar({ title, subtitle, onLogout }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 mb-6">
      <div className="glass-panel flex flex-col gap-4 rounded-[28px] px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">SoundShelf Studio</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-white">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-slate-300">{subtitle}</p> : null}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-11 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 text-slate-400">
            <FiSearch />
            <span className="text-sm">Search, vibe, discover</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <FiBell />
            </button>
            <Button
              type="button"
              variant="secondary"
              className="hidden sm:inline-flex"
              onClick={onLogout}
            >
              <FiLogOut />
              Logout
            </Button>
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-sm font-bold text-slate-950">
                {initialsFromName(user?.username || "SS")}
              </div>
              <div className="hidden pr-2 sm:block">
                <p className="text-sm font-semibold text-white">{user?.username || "Guest"}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {user?.role || "listener"}
                </p>
              </div>
              <FiUser className="mr-1 hidden text-slate-400 sm:block" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
