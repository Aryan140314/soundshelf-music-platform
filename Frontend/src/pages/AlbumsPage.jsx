import AlbumCard from "../components/AlbumCard";
import EmptyState from "../components/EmptyState";
import SkeletonCard from "../components/SkeletonCard";
import { useAuth } from "../hooks/useAuth";
import { useMusic } from "../hooks/useMusic";

export default function AlbumsPage() {
  const { role } = useAuth();
  const { albums, albumsLoading, artistAlbums } = useMusic();

  if (role === "artist") {
    return artistAlbums.length ? (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {artistAlbums.map((album) => (
          <AlbumCard key={album.id || album._id} album={album} />
        ))}
      </div>
    ) : (
      <EmptyState
        title="No artist albums in this session"
        description="Your backend does not expose artist album browsing endpoints yet, so this view shows albums you create during the current frontend session."
      />
    );
  }

  if (albumsLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} compact />
        ))}
      </div>
    );
  }

  if (!albums.length) {
    return (
      <EmptyState
        title="No albums yet"
        description="Once albums are published from artist accounts, they will appear here for listeners to explore."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {albums.map((album) => (
        <AlbumCard key={album._id} album={album} />
      ))}
    </div>
  );
}
