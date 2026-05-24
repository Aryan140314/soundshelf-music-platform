import { motion } from "framer-motion";
import { FiPause, FiPlay } from "react-icons/fi";
import { extractArtistName, initialsFromName } from "../utils/formatters";
import { cn } from "../utils/cn";

export default function MusicCard({
  track,
  onPlay,
  isActive = false,
  isPlaying = false,
  className,
}) {
  const artistName = extractArtistName(track.artist);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={cn("glass-panel rounded-[26px] p-4", className)}
    >
      <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-accent/40 via-slate-800 to-primary/20 p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_28%)]" />
        <div className="relative flex h-32 items-end justify-between">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12 font-display text-xl font-bold text-white">
              {initialsFromName(track.title)}
            </div>
            <div className="mt-5">
              <p className="max-w-[14rem] truncate font-display text-lg font-bold text-white">
                {track.title}
              </p>
              <p className="mt-1 text-sm text-slate-200">{artistName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPlay(track)}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full transition",
              isActive ? "bg-white text-slate-950" : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            {isActive && isPlaying ? <FiPause /> : <FiPlay />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
