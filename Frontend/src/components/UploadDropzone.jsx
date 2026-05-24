import { useRef } from "react";
import { motion } from "framer-motion";
import { FiMusic, FiUploadCloud } from "react-icons/fi";
import { cn } from "../utils/cn";

export default function UploadDropzone({ file, onChange, error }) {
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) {
      return;
    }

    onChange(selectedFile);
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        hidden
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={(event) => {
          event.preventDefault();
          handleFile(event.dataTransfer.files?.[0]);
        }}
        onDragOver={(event) => event.preventDefault()}
        className={cn(
          "glass-panel flex min-h-[190px] w-full flex-col items-center justify-center rounded-[28px] border border-dashed px-6 text-center",
          "transition hover:border-primary/45 hover:bg-white/8"
        )}
      >
        <div className="mb-4 rounded-full bg-white/8 p-4">
          <FiUploadCloud className="text-3xl text-primary" />
        </div>
        <p className="font-display text-lg font-bold text-white">Drop your track here</p>
        <p className="mt-2 text-sm text-slate-300">
          Drag and drop audio files or click to browse from your device.
        </p>
        {file ? (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
            <FiMusic />
            <span className="max-w-[16rem] truncate">{file.name}</span>
          </div>
        ) : null}
      </motion.button>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
