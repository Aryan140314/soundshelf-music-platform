import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import { extractArtistName, initialsFromName } from "../utils/formatters";

export default function AlbumCard({ album }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="glass-panel rounded-[26px] p-4">
      <div className="rounded-[22px] bg-gradient-to-br from-primary/15 via-slate-900 to-accent/20 p-5">
        <div className="flex h-36 items-start justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 font-display text-2xl font-bold text-white">
            {initialsFromName(album.title)}
          </div>
          <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-slate-300">
            Album
          </span>
        </div>
        <div className="mt-5">
          <p className="font-display text-xl font-bold text-white">{album.title}</p>
          <p className="mt-2 text-sm text-slate-300">{extractArtistName(album.artist)}</p>
          <Link
            to={`/albums/${album._id || album.id}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-white"
          >
            Open album <FiArrowUpRight />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
