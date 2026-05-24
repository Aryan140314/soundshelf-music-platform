import { NavLink } from "react-router-dom";
import {
  FiCompass,
  FiDisc,
  FiHome,
  FiLogOut,
  FiMic,
  FiMusic,
  FiPlusSquare,
  FiUser,
} from "react-icons/fi";
import { cn } from "../utils/cn";
import Button from "./Button";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar({ onLogout, mobile = false, onNavigate }) {
  const { role } = useAuth();

  const items = [
    { to: "/", icon: FiHome, label: "Home" },
    { to: "/explore", icon: FiCompass, label: "Explore" },
    { to: "/albums", icon: FiDisc, label: "Albums" },
    { to: "/artists", icon: FiMic, label: "Artists" },
    ...(role === "artist"
      ? [
          { to: "/artist/upload", icon: FiMusic, label: "Upload" },
          { to: "/artist/albums/new", icon: FiPlusSquare, label: "Create Album" },
        ]
      : []),
    { to: "/profile", icon: FiUser, label: "Profile" },
  ];

  return (
    <aside
      className={cn(
        "glass-panel h-full rounded-[30px] p-5",
        mobile ? "w-full" : "sticky top-6"
      )}
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Streaming</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-white">SoundShelf</h2>
        <p className="mt-2 text-sm text-slate-400">
          A premium streaming cockpit for listeners and artists.
        </p>
      </div>

      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-gradient-to-r from-primary/22 to-accent/18 text-white"
                  : "text-slate-300 hover:bg-white/6 hover:text-white"
              )
            }
          >
            <item.icon className="text-lg" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-[24px] border border-white/10 bg-white/6 p-4">
        <p className="font-display text-lg font-bold text-white">Need a break?</p>
        <p className="mt-2 text-sm text-slate-400">
          Your session stays cookie-secure while you sign out cleanly.
        </p>
        <Button
          variant="secondary"
          className="mt-4 w-full justify-center"
          onClick={onLogout}
        >
          <FiLogOut />
          Logout
        </Button>
      </div>
    </aside>
  );
}
