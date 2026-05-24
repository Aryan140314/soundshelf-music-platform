import { useMemo, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import EmptyState from "../components/EmptyState";
import { useMusic } from "../hooks/useMusic";
import { extractArtistName } from "../utils/formatters";

export default function CreateAlbumPage() {
  const { artistUploads, createAlbum } = useMusic();
  const [title, setTitle] = useState("");
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const selectedTrackObjects = useMemo(
    () => artistUploads.filter((track) => selectedTracks.includes(track.id)),
    [artistUploads, selectedTracks]
  );

  const toggleTrack = (trackId) => {
    setSelectedTracks((current) =>
      current.includes(trackId) ? current.filter((id) => id !== trackId) : [...current, trackId]
    );
  };

  const validate = () => {
    const nextErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Album title is required.";
    }

    if (!selectedTracks.length) {
      nextErrors.tracks = "Select at least one uploaded song.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      await createAlbum({ title, musics: selectedTracks });
      setTitle("");
      setSelectedTracks([]);
      setErrors({});
    } finally {
      setSubmitting(false);
    }
  };

  if (!artistUploads.length) {
    return (
      <EmptyState
        title="Upload songs before building an album"
        description="The album creator works from the artist uploads available in your current session. Add tracks in the upload dashboard first."
      />
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <section className="section-shell">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <Input
            label="Album title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="After Hours Sessions"
            error={errors.title}
          />
          <Button type="submit" className="lg:mb-[2px]" loading={submitting}>
            Create album
          </Button>
        </div>
      </section>

      <section className="section-shell">
        <div className="mb-5">
          <h3 className="section-title">Select uploaded songs</h3>
          <p className="mt-2 text-sm text-slate-400">
            Pick the songs you want to group into one album before sending them to the backend.
          </p>
          {errors.tracks ? <p className="mt-2 text-xs text-danger">{errors.tracks}</p> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {artistUploads.map((track) => {
            const selected = selectedTracks.includes(track.id);

            return (
              <button
                key={track.id}
                type="button"
                onClick={() => toggleTrack(track.id)}
                className={`rounded-[24px] border p-4 text-left transition ${
                  selected
                    ? "border-primary/50 bg-primary/10"
                    : "border-white/10 bg-white/5 hover:bg-white/8"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-lg font-bold text-white">{track.title}</p>
                    <p className="mt-2 text-sm text-slate-400">{extractArtistName(track.artist)}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      selected ? "bg-primary text-slate-950" : "bg-white/8 text-slate-300"
                    }`}
                  >
                    {selected ? "Selected" : "Pick"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="section-shell">
        <h3 className="section-title">Album preview</h3>
        <div className="mt-4 space-y-3">
          {selectedTrackObjects.length ? (
            selectedTrackObjects.map((track, index) => (
              <div key={track.id} className="glass-panel flex items-center gap-4 rounded-[20px] px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm text-slate-300">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-white">{track.title}</p>
                  <p className="text-sm text-slate-400">{extractArtistName(track.artist)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">Selected songs will appear here as your album takes shape.</p>
          )}
        </div>
      </section>
    </form>
  );
}
