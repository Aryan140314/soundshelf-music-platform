import { useMemo, useState } from "react";
import { FiBarChart2, FiClock, FiUploadCloud } from "react-icons/fi";
import Input from "../components/Input";
import Button from "../components/Button";
import UploadDropzone from "../components/UploadDropzone";
import EmptyState from "../components/EmptyState";
import MusicCard from "../components/MusicCard";
import { useMusic } from "../hooks/useMusic";

export default function ArtistDashboardPage() {
  const { uploadMusic, artistUploads, artistAlbums, playTrack, currentTrack, isPlaying } = useMusic();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const analytics = useMemo(
    () => [
      { label: "Uploads this session", value: artistUploads.length, icon: FiUploadCloud },
      { label: "Albums created", value: artistAlbums.length, icon: FiBarChart2 },
      { label: "Ready to compile", value: artistUploads.length > 0 ? "Yes" : "No", icon: FiClock },
    ],
    [artistAlbums.length, artistUploads.length]
  );

  const validate = () => {
    const nextErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Track title is required.";
    }

    if (!file) {
      nextErrors.file = "Select an audio file to upload.";
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
    setProgress(0);

    try {
      await uploadMusic({
        title,
        file,
        onUploadProgress: (eventData) => {
          if (!eventData.total) {
            return;
          }

          const nextValue = Math.round((eventData.loaded / eventData.total) * 100);
          setProgress(nextValue);
        },
      });
      setTitle("");
      setFile(null);
      setErrors({});
      setProgress(100);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {analytics.map((item) => (
          <div key={item.label} className="glass-panel rounded-[26px] p-5">
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
      </section>

      <section className="section-shell">
        <div className="mb-6">
          <h3 className="section-title">Upload a new track</h3>
          <p className="mt-2 text-sm text-slate-400">
            Files are sent as multipart form data directly to your backend and stored through ImageKit.
          </p>
        </div>

        <form className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Track title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Midnight Echoes"
              error={errors.title}
            />
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Upload progress</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <Button type="submit" loading={submitting}>
              Publish track
            </Button>
          </div>

          <UploadDropzone file={file} onChange={setFile} error={errors.file} />
        </form>
      </section>

      <section className="section-shell">
        <div className="mb-5">
          <h3 className="section-title">Your uploaded songs</h3>
          <p className="mt-2 text-sm text-slate-400">
            The current backend does not expose an artist library fetch route, so this list reflects uploads created during the active frontend session.
          </p>
        </div>

        {artistUploads.length ? (
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
        ) : (
          <EmptyState
            title="No songs uploaded yet"
            description="Use the form above to upload your first release and it will appear here immediately."
          />
        )}
      </section>
    </div>
  );
}
