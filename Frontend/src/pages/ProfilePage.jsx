import { FiShield, FiUser } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

export default function ProfilePage() {
  const { user, role, isAuthenticated } = useAuth();

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <section className="section-shell">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-primary to-accent text-slate-950">
            <FiUser className="text-2xl" />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-white">{user?.username}</h2>
            <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            { label: "Role", value: role },
            { label: "Session state", value: isAuthenticated ? "Authenticated" : "Logged out" },
          ].map((item) => (
            <div key={item.label} className="glass-panel rounded-[22px] p-4">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-2 font-display text-xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-3 text-primary">
            <FiShield className="text-2xl" />
          </div>
          <div>
            <h3 className="section-title">Authentication model</h3>
            <p className="mt-1 text-sm text-slate-400">How this frontend stays aligned with your backend.</p>
          </div>
        </div>
        <div className="mt-6 space-y-3 text-sm leading-7 text-slate-300">
          <p>The frontend sends every request with `withCredentials: true` so the backend JWT cookie is always included.</p>
          <p>Role-aware routes keep artist tooling and listener browsing in separate flows.</p>
          <p>Because the backend does not expose a `current user` endpoint yet, the frontend caches basic user profile data locally to restore the app shell after refresh.</p>
        </div>
      </section>
    </div>
  );
}
