import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiBarChart2, FiDisc, FiUploadCloud } from "react-icons/fi";
import MusicCard from "../components/MusicCard";
import AlbumCard from "../components/AlbumCard";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import { useMusic } from "../hooks/useMusic";
import { useAuth } from "../hooks/useAuth";
import { extractArtistName } from "../utils/formatters";

export default function HomePage() {
  const { role } = useAuth();
  const {
    tracks,
    albums,
    playTrack,
    currentTrack,
    isPlaying,
    musicLoading,
    albumsLoading,
    artistUploads,
    artistAlbums,
  } = useMusic();

  if (role === "artist") {
    return (
      <div className="space-y-6">
        <section className="section-shell overflow-hidden bg-hero">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Artist studio</p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-bold text-white">
                Build your next release from one focused creative dashboard.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Upload new songs, group them into albums, and use the local session insights here
                while the current backend keeps upload endpoints artist-only.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/artist/upload"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-5 text-sm font-semibold text-slate-950 shadow-glow transition hover:brightness-110"
                >
                  Upload track
                </Link>
                <Link
                  to="/artist/albums/new"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Create album
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                { label: "Tracks uploaded this session", value: artistUploads.length, icon: FiUploadCloud },
                { label: "Albums created this session", value: artistAlbums.length, icon: FiDisc },
                { label: "Creative actions", value: artistAlbums.length + artistUploads.length, icon: FiBarChart2 },
              ].map((item) => (
                <div key={item.label} className="glass-panel rounded-[24px] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{item.label}</p>
                      <p className="mt-2 font-display text-3xl font-bold text-white">{item.value}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3 text-primary">
                      <item.icon className="text-2xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {artistUploads.length ? (
          <section className="section-shell">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="section-title">Recent uploads</h3>
                <p className="mt-1 text-sm text-slate-400">Instantly available from this session.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {artistUploads.map((track) => (
                <MusicCard
                  key={track.id}
                  track={track}
                  onPlay={(selected) => playTrack(selected, artistUploads)}
                  isActive={currentTrack?.id === track.id}
                  isPlaying={isPlaying}
                />
              ))}
            </div>
          </section>
        ) : (
          <EmptyState
            title="No uploads yet"
            description="Start by uploading your first song from the artist dashboard. Once uploaded, tracks will appear here and be available for album creation."
            action={
              <Link
                to="/artist/upload"
                className="inline-flex rounded-full bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-semibold text-slate-950"
              >
                Open artist dashboard
              </Link>
            }
          />
        )}
      </div>
    );
  }

  const trendingTracks = tracks.slice(0, 6);
  const featuredAlbums = albums.slice(0, 4);
  const recentTracks = [...tracks].slice(-6).reverse();
  const popularArtists = Array.from(
    new Map(
      tracks.map((track) => {
        const name = extractArtistName(track.artist);
        return [name, { name, count: tracks.filter((song) => extractArtistName(song.artist) === name).length }];
      })
    ).values()
  ).slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="section-shell overflow-hidden bg-hero">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs uppercase tracking-[0.35em] text-primary">For listeners</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight text-white md:text-5xl">
              Hear the next drop before it becomes everyone else&apos;s repeat obsession.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Discover freshly uploaded songs, wander through featured albums, and keep seamless
              playback anchored in a rich dark interface.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/explore"
                className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-5 text-sm font-semibold text-slate-950"
              >
                Explore tracks
              </Link>
              <Link
                to="/albums"
                className="inline-flex h-11 items-center justify-center rounded-full bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Browse albums
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Tracks in feed", value: tracks.length || "00" },
              { label: "Featured albums", value: albums.length || "00" },
              { label: "Playback ready", value: currentTrack ? "Live" : "Idle" },
              { label: "Fresh upload vibe", value: "Daily" },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -4 }}
                className="glass-panel rounded-[24px] p-5"
              >
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-3 font-display text-3xl font-bold text-white">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="section-title">Trending now</h3>
            <p className="mt-1 text-sm text-slate-400">Fast access to the songs leading the room.</p>
          </div>
          <Link to="/explore" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            See all <FiArrowRight />
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {(musicLoading ? Array.from({ length: 3 }) : trendingTracks).map((item, index) =>
            musicLoading ? (
              <SkeletonCard key={`trend-${index}`} />
            ) : (
              <MusicCard
                key={item.id}
                track={item}
                onPlay={(selected) => playTrack(selected, tracks)}
                isActive={currentTrack?.id === item.id}
                isPlaying={isPlaying}
              />
            )
          )}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="section-shell">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="section-title">Featured albums</h3>
              <p className="mt-1 text-sm text-slate-400">Collections worth playing from top to bottom.</p>
            </div>
            <Link to="/albums" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Open albums <FiArrowRight />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(albumsLoading ? Array.from({ length: 4 }) : featuredAlbums).map((item, index) =>
              albumsLoading ? <SkeletonCard key={`album-${index}`} compact /> : <AlbumCard key={item._id} album={item} />
            )}
          </div>
        </section>

        <section className="section-shell">
          <div>
            <h3 className="section-title">Popular artists</h3>
            <p className="mt-1 text-sm text-slate-400">Faces and names behind the sound moving through the app.</p>
          </div>
          <div className="mt-5 space-y-4">
            {popularArtists.length ? (
              popularArtists.map((artist) => (
                <div key={artist.name} className="glass-panel flex items-center justify-between rounded-[22px] p-4">
                  <div>
                    <p className="font-display text-lg font-bold text-white">{artist.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{artist.count} tracks in rotation</p>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.25em] text-primary">
                    Artist
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="Artists will appear here"
                description="Once the music feed loads, we will surface the creators behind each track."
              />
            )}
          </div>
        </section>
      </div>

      <section className="section-shell">
        <div className="mb-5">
          <h3 className="section-title">Recently uploaded</h3>
          <p className="mt-1 text-sm text-slate-400">Fresh additions to the catalog, ready to play.</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {(musicLoading ? Array.from({ length: 4 }) : recentTracks).map((item, index) =>
            musicLoading ? (
              <div key={`recent-${index}`} className="min-w-[280px] flex-1">
                <SkeletonCard />
              </div>
            ) : (
              <div key={item.id} className="min-w-[280px] flex-1">
                <MusicCard
                  track={item}
                  onPlay={(selected) => playTrack(selected, recentTracks)}
                  isActive={currentTrack?.id === item.id}
                  isPlaying={isPlaying}
                />
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
