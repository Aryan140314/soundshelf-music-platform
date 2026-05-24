const AUTH_KEY = "soundshelf_user";
const ARTIST_UPLOADS_KEY = "soundshelf_artist_uploads";
const ARTIST_ALBUMS_KEY = "soundshelf_artist_albums";

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

export function setStoredUser(user) {
  try {
    if (!user) {
      localStorage.removeItem(AUTH_KEY);
      return;
    }

    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch (error) {
    return;
  }
}

export function clearStoredUser() {
  setStoredUser(null);
}

export function getStoredArtistState() {
  try {
    return {
      uploads: JSON.parse(localStorage.getItem(ARTIST_UPLOADS_KEY) || "[]"),
      albums: JSON.parse(localStorage.getItem(ARTIST_ALBUMS_KEY) || "[]"),
    };
  } catch (error) {
    return {
      uploads: [],
      albums: [],
    };
  }
}

export function setStoredArtistState({ uploads, albums }) {
  try {
    if (uploads) {
      localStorage.setItem(ARTIST_UPLOADS_KEY, JSON.stringify(uploads));
    }

    if (albums) {
      localStorage.setItem(ARTIST_ALBUMS_KEY, JSON.stringify(albums));
    }
  } catch (error) {
    return;
  }
}

export function clearStoredArtistState() {
  try {
    localStorage.removeItem(ARTIST_UPLOADS_KEY);
    localStorage.removeItem(ARTIST_ALBUMS_KEY);
  } catch (error) {
    return;
  }
}
