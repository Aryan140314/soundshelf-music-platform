import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { FiPlay } from "react-icons/fi";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { useMusic } from "../hooks/useMusic";
import { extractArtistName, normalizeTrack } from "../utils/formatters";

export default function AlbumDetailsPage() {
  const { albumId } = useParams();
  const { role } = useAuth();
  const { fetchAlbumById, playTrack, currentTrack, isPlaying, artistAlbums, artistUploads } = useMusic();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  const localArtistAlbum = useMemo(
    () => artistAlbums.find((item) => (item.id || item._id) === albumId),
    [albumId, artistAlbums]
  );

  useEffect(() => {
    let mounted = true;

    async function loadAlbum() {
      if (role === "artist") {
        setAlbum(localArtistAlbum || null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchAlbumById(albumId);
        if (mounted) {
          setAlbum(data);
        }
      } catch (error) {
        if (mounted) {
          setAlbum(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAlbum();

    return () => {
      mounted = false;
    };
  }, [albumId, fetchAlbumById, localArtistAlbum, role]);

  if (loading) {
    return <Loader label="Loading album details..." />;
  }

  if (!album) {
    return (
      <EmptyState
        title="Album not found"
        description="This album could not be loaded. It may not exist for your current role or session."
      />
    );
  }

  const tracks = role === "artist"
    ? (album.musics || [])
        .map((musicId) => artistUploads.find((track) => track.id === musicId || track._id === musicId))
        .filter(Boolean)
    : (album.musics || []).map(normalizeTrack).filter(Boolean);

  return (
    <div className="space-y-6">
      <section className="section-shell overflow-hidden bg-hero">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-end">
          <div className="flex h-[280px] items-end rounded-[30px] bg-gradient-to-br from-accent/35 via-slate-900 to-primary/20 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Album</p>
              <h2 className="mt-4 font-display text-4xl font-bold text-white">{album.title}</h2>
            </div>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary">By {extractArtistName(album.artist)}</p>
            <h3 className="mt-4 font-display text-3xl font-bold text-white">
              {tracks.length} tracks ready for play-through
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Press play all to start the full album run, or trigger an individual track from the list below.
            </p>
            <Button
              className="mt-6"
              onClick={() => {
                if (tracks[0]) {
                  playTrack(tracks[0], tracks);
                }
              }}
            >
              <FiPlay />
              Play all
            </Button>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="space-y-3">
          {tracks.length ? (
            tracks.map((track, index) => (
              <button
                key={track.id}
                type="button"
                onClick={() => playTrack(track, tracks)}
                className="glass-panel flex w-full items-center justify-between rounded-[22px] px-4 py-4 text-left transition hover:bg-white/8"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-slate-300">
                    {(index + 1).toString().padStart(2, "0")}
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-white">{track.title}</p>
                    <p className="text-sm text-slate-400">{extractArtistName(track.artist || album.artist)}</p>
                  </div>
                </div>
                <span className="text-sm text-slate-400">
                  {currentTrack?.id === track.id && isPlaying ? "Playing" : "Play"}
                </span>
              </button>
            ))
          ) : (
            <EmptyState
              title="No tracks attached"
              description="This album currently does not expose a track list in your active session."
            />
          )}
        </div>
      </section>
    </div>
  );
}
