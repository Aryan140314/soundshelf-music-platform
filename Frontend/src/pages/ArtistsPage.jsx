import { useMemo } from "react";
import { FiMic } from "react-icons/fi";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../hooks/useAuth";
import { useMusic } from "../hooks/useMusic";
import { extractArtistName, initialsFromName } from "../utils/formatters";

export default function ArtistsPage() {
  const { role, user } = useAuth();
  const { tracks } = useMusic();

  const artists = useMemo(() => {
    const map = new Map();

    tracks.forEach((track) => {
      const name = extractArtistName(track.artist);
      if (!map.has(name)) {
        map.set(name, {
          name,
          email: track.artist?.email || "No public email",
          tracks: 0,
        });
      }

      map.get(name).tracks += 1;
    });

    return Array.from(map.values());
  }, [tracks]);

  if (role === "artist") {
    return (
      <div className="section-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary">Artist identity</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white">{user?.username}</h2>
            <p className="mt-2 text-sm text-slate-300">
              Your backend currently reserves artist browsing for upload-focused flows, so this page
              highlights your creator identity instead of the full public artist roster.
            </p>
          </div>
          <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-primary to-accent font-display text-3xl font-bold text-slate-950">
            {initialsFromName(user?.username || "AR")}
          </div>
        </div>
      </div>
    );
  }

  if (!artists.length) {
    return (
      <EmptyState
        title="No artists surfaced yet"
        description="When the music feed contains tracks with populated artist details, they will appear here."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {artists.map((artist) => (
        <div key={artist.name} className="glass-panel rounded-[26px] p-5">
          <div className="flex items-start justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary">
              <FiMic className="text-2xl" />
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
              {artist.tracks} tracks
            </span>
          </div>
          <p className="mt-5 font-display text-xl font-bold text-white">{artist.name}</p>
          <p className="mt-2 text-sm text-slate-400">{artist.email}</p>
        </div>
      ))}
    </div>
  );
}
