import { motion } from "framer-motion";
import { FiPause, FiPlay, FiSkipBack, FiSkipForward, FiVolume2 } from "react-icons/fi";
import { useMusic } from "../hooks/useMusic";
import { extractArtistName, formatDuration, initialsFromName } from "../utils/formatters";

export default function Player() {
  const {
    currentTrack,
    currentTime,
    duration,
    isPlaying,
    volume,
    togglePlayback,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
  } = useMusic();

  if (!currentTrack) {
    return (
      <footer className="glass-panel mt-6 rounded-[30px] p-4">
        <div className="flex flex-col items-center justify-center gap-2 py-4 text-center">
          <p className="font-display text-lg font-bold text-white">Nothing playing yet</p>
          <p className="text-sm text-slate-400">
            Pick a track from Explore, Home, or an album to start your session.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <motion.footer
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel mt-6 rounded-[30px] p-4"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-accent/45 to-primary/30 font-display text-xl font-bold text-white">
            {initialsFromName(currentTrack.title)}
          </div>
          <div>
            <p className="font-display text-lg font-bold text-white">{currentTrack.title}</p>
            <p className="text-sm text-slate-400">{extractArtistName(currentTrack.artist)}</p>
          </div>
        </div>

        <div className="flex-1 space-y-3 xl:max-w-2xl">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={playPrevious}
              className="rounded-full bg-white/6 p-3 text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              <FiSkipBack />
            </button>
            <button
              type="button"
              onClick={togglePlayback}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-950 transition hover:scale-105"
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>
            <button
              type="button"
              onClick={playNext}
              className="rounded-full bg-white/6 p-3 text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              <FiSkipForward />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{formatDuration(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={(event) => seekTo(Number(event.target.value))}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/10"
            />
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 xl:w-48">
          <FiVolume2 className="text-slate-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/10"
          />
        </div>
      </div>
    </motion.footer>
  );
}
