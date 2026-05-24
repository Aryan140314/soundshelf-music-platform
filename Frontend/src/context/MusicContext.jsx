import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import api from "../services/api";
import { normalizeTrack } from "../utils/formatters";
import { useAuthContext } from "./AuthContext";
import { useToastContext } from "./ToastContext";
import {
  clearStoredArtistState,
  getStoredArtistState,
  setStoredArtistState,
} from "../utils/storage";

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const { user, role, isAuthenticated, setUser } = useAuthContext();
  const toast = useToastContext();
  const audioRef = useRef(null);
  const storedArtistState = getStoredArtistState();

  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [musicLoading, setMusicLoading] = useState(false);
  const [albumsLoading, setAlbumsLoading] = useState(false);
  const [artistUploads, setArtistUploads] = useState(storedArtistState.uploads || []);
  const [artistAlbums, setArtistAlbums] = useState(storedArtistState.albums || []);

  useEffect(() => {
    setStoredArtistState({ uploads: artistUploads, albums: artistAlbums });
  }, [artistAlbums, artistUploads]);

  useEffect(() => {
    if (!isAuthenticated) {
      setArtistUploads([]);
      setArtistAlbums([]);
      clearStoredArtistState();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const fetchTracks = useCallback(async () => {
    if (!isAuthenticated || role !== "user") {
      setTracks([]);
      return [];
    }

    setMusicLoading(true);
    try {
      const { data } = await api.get("/music");
      const normalized = (data.musics || []).map(normalizeTrack).filter(Boolean);
      setTracks(normalized);
      return normalized;
    } catch (error) {
      if (error.status === 401) {
        setUser(null);
      }
      toast.error("Unable to load tracks", error.friendlyMessage);
      throw error;
    } finally {
      setMusicLoading(false);
    }
  }, [isAuthenticated, role, toast]);

  const fetchAlbums = useCallback(async () => {
    if (!isAuthenticated || role !== "user") {
      setAlbums([]);
      return [];
    }

    setAlbumsLoading(true);
    try {
      const { data } = await api.get("/music/albums");
      setAlbums(data.albums || []);
      return data.albums || [];
    } catch (error) {
      if (error.status === 401) {
        setUser(null);
      }
      toast.error("Unable to load albums", error.friendlyMessage);
      throw error;
    } finally {
      setAlbumsLoading(false);
    }
  }, [isAuthenticated, role, toast]);

  useEffect(() => {
    if (isAuthenticated && role === "user") {
      fetchTracks().catch(() => null);
      fetchAlbums().catch(() => null);
      return;
    }

    setTracks([]);
    setAlbums([]);
  }, [fetchAlbums, fetchTracks, isAuthenticated, role]);

  const playTrack = useCallback(
    async (track, sourceQueue = tracks) => {
      if (!track?.uri) {
        toast.info("Track unavailable", "This song does not have a playable source.");
        return;
      }

      setCurrentTrack(track);
      setQueue(sourceQueue);
      setIsPlaying(true);

      if (audioRef.current) {
        audioRef.current.src = track.uri;
        await audioRef.current.play().catch(() => {
          setIsPlaying(false);
          toast.error("Playback blocked", "Your browser blocked autoplay. Press play again.");
        });
      }
    },
    [toast, tracks]
  );

  const pauseTrack = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const resumeTrack = useCallback(async () => {
    if (!audioRef.current || !currentTrack) {
      return;
    }

    await audioRef.current.play().catch(() => {
      toast.error("Playback failed", "The current track could not resume.");
    });
    setIsPlaying(true);
  }, [currentTrack, toast]);

  const togglePlayback = useCallback(() => {
    if (!currentTrack) {
      return;
    }

    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  }, [currentTrack, isPlaying, pauseTrack, resumeTrack]);

  const playNext = useCallback(() => {
    if (!currentTrack || queue.length === 0) {
      return;
    }

    const currentIndex = queue.findIndex((item) => item.id === currentTrack.id);
    const nextTrack = queue[(currentIndex + 1) % queue.length];

    if (nextTrack) {
      playTrack(nextTrack, queue).catch(() => null);
    }
  }, [currentTrack, playTrack, queue]);

  const playPrevious = useCallback(() => {
    if (!currentTrack || queue.length === 0) {
      return;
    }

    const currentIndex = queue.findIndex((item) => item.id === currentTrack.id);
    const previousIndex = (currentIndex - 1 + queue.length) % queue.length;
    const previousTrack = queue[previousIndex];

    if (previousTrack) {
      playTrack(previousTrack, queue).catch(() => null);
    }
  }, [currentTrack, playTrack, queue]);

  const seekTo = useCallback((value) => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime = value;
    setCurrentTime(value);
  }, []);

  const fetchAlbumById = useCallback(
    async (albumId) => {
      const { data } = await api.get(`/music/albums/${albumId}`);
      return data.album;
    },
    []
  );

  const uploadMusic = useCallback(
    async ({ title, file, onUploadProgress }) => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("music", file);

      const { data } = await api.post("/music/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      });

      const enrichedTrack = normalizeTrack({
        ...data.music,
        artist: {
          id: user?.id,
          username: user?.username,
          email: user?.email,
        },
      });
      setArtistUploads((current) => [enrichedTrack, ...current]);
      toast.success("Track uploaded", "Your new song is live on SoundShelf.");
      return enrichedTrack;
    },
    [toast, user]
  );

  const createAlbum = useCallback(
    async ({ title, musics }) => {
      const { data } = await api.post("/music/album", { title, musics });
      const enrichedAlbum = {
        ...data.album,
        artist: {
          id: user?.id,
          username: user?.username,
          email: user?.email,
        },
      };
      setArtistAlbums((current) => [enrichedAlbum, ...current]);
      toast.success("Album created", "Your collection has been published.");
      return enrichedAlbum;
    },
    [toast, user]
  );

  const value = useMemo(
    () => ({
      user,
      tracks,
      albums,
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      musicLoading,
      albumsLoading,
      artistUploads,
      artistAlbums,
      audioRef,
      setCurrentTime,
      setDuration,
      setVolume,
      fetchTracks,
      fetchAlbums,
      fetchAlbumById,
      playTrack,
      pauseTrack,
      resumeTrack,
      togglePlayback,
      playNext,
      playPrevious,
      seekTo,
      uploadMusic,
      createAlbum,
    }),
    [
      albums,
      albumsLoading,
      artistAlbums,
      artistUploads,
      createAlbum,
      currentTime,
      currentTrack,
      duration,
      fetchAlbumById,
      fetchAlbums,
      fetchTracks,
      isPlaying,
      musicLoading,
      pauseTrack,
      playNext,
      playPrevious,
      playTrack,
      resumeTrack,
      seekTo,
      togglePlayback,
      tracks,
      uploadMusic,
      user,
      volume,
    ]
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onEnded={playNext}
      />
    </MusicContext.Provider>
  );
}

export function useMusicContext() {
  const context = useContext(MusicContext);

  if (!context) {
    throw new Error("useMusicContext must be used within MusicProvider");
  }

  return context;
}
