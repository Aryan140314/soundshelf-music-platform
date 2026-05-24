import { useDeferredValue, useMemo, useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import MusicCard from "../components/MusicCard";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import Input from "../components/Input";
import { useAuth } from "../hooks/useAuth";
import { useMusic } from "../hooks/useMusic";
import { extractArtistName } from "../utils/formatters";

export default function ExplorePage() {
  const { role } = useAuth();
  const { tracks, musicLoading, playTrack, currentTrack, isPlaying } = useMusic();
  const [search, setSearch] = useState("");
  const [artistFilter, setArtistFilter] = useState("all");
  const deferredSearch = useDeferredValue(search);

  const artists = useMemo(
    () => ["all", ...new Set(tracks.map((track) => extractArtistName(track.artist)))],
    [tracks]
  );

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const titleMatch = track.title.toLowerCase().includes(deferredSearch.toLowerCase());
      const artistName = extractArtistName(track.artist);
      const artistMatch = artistFilter === "all" || artistName === artistFilter;
      return titleMatch && artistMatch;
    });
  }, [artistFilter, deferredSearch, tracks]);

  if (role !== "user") {
    return (
      <EmptyState
        title="Explore is listener-only right now"
        description="Your backend currently allows music browsing only for users with the user role. Artists can keep creating from the upload and album pages."
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="section-shell">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
          <Input
            label="Search music"
            icon={FiSearch}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search songs by title..."
          />
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">Filter by artist</span>
            <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4">
              <FiFilter className="text-slate-400" />
              <select
                value={artistFilter}
                onChange={(event) => setArtistFilter(event.target.value)}
                className="h-full w-full bg-transparent text-sm text-white"
              >
                {artists.map((artist) => (
                  <option key={artist} value={artist} className="bg-panel text-white">
                    {artist === "all" ? "All artists" : artist}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>
      </section>

      {musicLoading ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </section>
      ) : filteredTracks.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTracks.map((track) => (
            <MusicCard
              key={track.id}
              track={track}
              onPlay={(selected) => playTrack(selected, filteredTracks)}
              isActive={currentTrack?.id === track.id}
              isPlaying={isPlaying}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No songs match your filters"
          description="Try a broader search or reset the artist filter to bring the full music grid back."
        />
      )}
    </div>
  );
}
