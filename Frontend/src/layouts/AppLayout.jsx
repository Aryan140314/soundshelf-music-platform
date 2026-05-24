import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiCompass, FiHome, FiLogOut, FiMenu, FiMusic, FiUser } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Player from "../components/Player";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

const PAGE_META = [
  {
    match: (pathname) => pathname === "/",
    title: "Home",
    subtitle: "Your music command center for discovery, focus, and artist momentum.",
  },
  {
    match: (pathname) => pathname.startsWith("/explore"),
    title: "Explore",
    subtitle: "Search through tracks, jump between artists, and keep your next favorite close.",
  },
  {
    match: (pathname) => pathname === "/albums",
    title: "Albums",
    subtitle: "Browse polished releases and deep-dive into every collection.",
  },
  {
    match: (pathname) => pathname.startsWith("/albums/"),
    title: "Album Details",
    subtitle: "Track-by-track view with instant playback and artist context.",
  },
  {
    match: (pathname) => pathname.startsWith("/artists"),
    title: "Artists",
    subtitle: "Spotlight creators, identities, and who is shaping the room right now.",
  },
  {
    match: (pathname) => pathname.startsWith("/artist/upload"),
    title: "Artist Dashboard",
    subtitle: "Upload songs, track creative output, and grow your catalog.",
  },
  {
    match: (pathname) => pathname.startsWith("/artist/albums/new"),
    title: "Create Album",
    subtitle: "Turn your uploaded tracks into a release-ready album.",
  },
  {
    match: (pathname) => pathname.startsWith("/profile"),
    title: "Profile",
    subtitle: "Review your account details, access role context, and manage your session.",
  },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, role } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const meta = useMemo(
    () => PAGE_META.find((item) => item.match(location.pathname)) || PAGE_META[0],
    [location.pathname]
  );

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
    navigate("/login");
  };

  const mobileItems = [
    { to: "/", icon: FiHome, label: "Home" },
    { to: "/explore", icon: FiCompass, label: "Explore" },
    ...(role === "artist" ? [{ to: "/artist/upload", icon: FiMusic, label: "Upload" }] : []),
    { to: "/profile", icon: FiUser, label: "Profile" },
    { action: "logout", icon: FiLogOut, label: "Logout" },
  ];

  return (
    <div className="min-h-screen pb-28">
      <div className="mx-auto max-w-[1600px] px-4 py-4 md:px-6 md:py-6">
        <div className="mb-4 flex items-center justify-between md:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="glass-panel rounded-2xl p-3 text-white"
          >
            <FiMenu className="text-xl" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary">SoundShelf</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="hidden xl:block">
            <Sidebar onLogout={() => setShowLogoutModal(true)} />
          </div>

          <main className="min-w-0">
            <Navbar
              title={meta.title}
              subtitle={meta.subtitle}
              onLogout={() => setShowLogoutModal(true)}
            />
            <Outlet />
            <Player />
          </main>
        </div>
      </div>

      <div className="fixed bottom-4 left-4 right-4 z-40 xl:hidden">
        <div className="glass-panel flex items-center justify-around rounded-[24px] px-3 py-2">
          {mobileItems.map((item) => (
            <button
              key={item.to || item.action}
              type="button"
              onClick={() => {
                if (item.action === "logout") {
                  setShowLogoutModal(true);
                  return;
                }

                navigate(item.to);
              }}
              className="flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs text-slate-300 transition hover:bg-white/6 hover:text-white"
            >
              <item.icon className="text-lg" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isSidebarOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 p-4 backdrop-blur-sm xl:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="h-full max-w-sm"
              onClick={(event) => event.stopPropagation()}
            >
              <Sidebar
                mobile
                onLogout={() => {
                  setShowLogoutModal(true);
                  setIsSidebarOpen(false);
                }}
                onNavigate={() => setIsSidebarOpen(false)}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Modal
        open={showLogoutModal}
        title="Sign out of SoundShelf?"
        description="You can log back in at any time. Your cookie session will be closed."
        onClose={() => setShowLogoutModal(false)}
      >
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Modal>
    </div>
  );
}
