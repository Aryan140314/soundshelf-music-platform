export function formatDuration(seconds = 0) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}

export function extractArtistName(artist) {
  if (!artist) {
    return "Unknown Artist";
  }

  if (typeof artist === "string") {
    return artist;
  }

  return artist.username || artist.email || "Unknown Artist";
}

export function initialsFromName(name = "SS") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function normalizeTrack(rawTrack) {
  if (!rawTrack) {
    return null;
  }

  return {
    id: rawTrack.id || rawTrack._id,
    title: rawTrack.title || "Untitled Track",
    uri: rawTrack.uri || "",
    artist: rawTrack.artist,
  };
}
