const storageKeys = {
    user: "soundshelf_user",
    artistMusics: "soundshelf_artist_musics",
};

const state = {
    authView: "login",
    user: readJson(storageKeys.user),
    artistMusics: readJson(storageKeys.artistMusics, []),
    musics: [],
    albums: [],
    selectedAlbum: null,
};

const elements = {
    sessionSummary: document.getElementById("sessionSummary"),
    logoutButton: document.getElementById("logoutButton"),
    guestNote: document.getElementById("guestNote"),
    loginForm: document.getElementById("loginForm"),
    registerForm: document.getElementById("registerForm"),
    authButtons: document.querySelectorAll("[data-auth-view]"),
    welcomePanel: document.getElementById("welcomePanel"),
    artistPanel: document.getElementById("artistPanel"),
    userPanel: document.getElementById("userPanel"),
    uploadMusicForm: document.getElementById("uploadMusicForm"),
    createAlbumForm: document.getElementById("createAlbumForm"),
    albumMusicOptions: document.getElementById("albumMusicOptions"),
    manualMusicIds: document.getElementById("manualMusicIds"),
    artistMusicList: document.getElementById("artistMusicList"),
    refreshLibraryButton: document.getElementById("refreshLibraryButton"),
    musicList: document.getElementById("musicList"),
    albumList: document.getElementById("albumList"),
    albumDetail: document.getElementById("albumDetail"),
    toast: document.getElementById("toast"),
};

let toastTimer = null;

bootstrap();

function bootstrap() {
    bindEvents();
    setAuthView(state.authView);
    renderSession();
    renderArtistMusicOptions();
    renderArtistMusicList();
    renderMusicList();
    renderAlbumList();
    renderAlbumDetail();

    if (state.user?.role === "user") {
        loadUserLibrary();
    }
}

function bindEvents() {
    elements.authButtons.forEach((button) => {
        button.addEventListener("click", () => setAuthView(button.dataset.authView));
    });

    elements.loginForm.addEventListener("submit", handleLogin);
    elements.registerForm.addEventListener("submit", handleRegister);
    elements.logoutButton.addEventListener("click", handleLogout);
    elements.uploadMusicForm.addEventListener("submit", handleMusicUpload);
    elements.createAlbumForm.addEventListener("submit", handleAlbumCreate);
    elements.refreshLibraryButton.addEventListener("click", loadUserLibrary);

    elements.albumList.addEventListener("click", async (event) => {
        const button = event.target.closest("[data-album-id]");
        if (!button) {
            return;
        }

        await loadAlbumDetail(button.dataset.albumId);
    });
}

function setAuthView(view) {
    state.authView = view;

    elements.authButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.authView === view);
    });

    elements.loginForm.classList.toggle("is-hidden", view !== "login");
    elements.registerForm.classList.toggle("is-hidden", view !== "register");
}

async function handleLogin(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const identity = String(formData.get("identity") || "").trim();
    const password = String(formData.get("password") || "");
    const payload = { password };

    if (identity.includes("@")) {
        payload.email = identity;
    } else {
        payload.username = identity;
    }

    try {
        const data = await api("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(payload),
        });

        state.user = data.user;
        persistJson(storageKeys.user, data.user);
        showToast(data.message || "Login successful", "success");
        event.currentTarget.reset();
        afterAuthChange();
    } catch (error) {
        showToast(error.message, "error");
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
        username: String(formData.get("username") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        password: String(formData.get("password") || ""),
        role: String(formData.get("role") || "user"),
    };

    try {
        const data = await api("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(payload),
        });

        state.user = data.user;
        persistJson(storageKeys.user, data.user);
        showToast(data.message || "Account created", "success");
        event.currentTarget.reset();
        afterAuthChange();
    } catch (error) {
        showToast(error.message, "error");
    }
}

async function handleLogout() {
    try {
        const data = await api("/api/auth/logout", {
            method: "POST",
        });

        showToast(data.message || "Logged out", "success");
    } catch (error) {
        showToast(error.message, "error");
    } finally {
        clearSession();
    }
}

async function handleMusicUpload(event) {
    event.preventDefault();

    if (state.user?.role !== "artist") {
        showToast("Login as an artist to upload music.", "error");
        return;
    }

    const formData = new FormData(event.currentTarget);

    try {
        const data = await api("/api/music/upload", {
            method: "POST",
            body: formData,
        });

        const createdMusic = data.music;
        state.artistMusics = [createdMusic, ...state.artistMusics];
        persistJson(storageKeys.artistMusics, state.artistMusics);
        renderArtistMusicOptions();
        renderArtistMusicList();
        event.currentTarget.reset();
        showToast(data.message || "Music uploaded", "success");
    } catch (error) {
        handleProtectedError(error);
    }
}

async function handleAlbumCreate(event) {
    event.preventDefault();

    if (state.user?.role !== "artist") {
        showToast("Login as an artist to create albums.", "error");
        return;
    }

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") || "").trim();
    const selectedIds = Array.from(document.querySelectorAll('input[name="albumMusic"]:checked'))
        .map((input) => input.value);
    const manualIds = String(formData.get("manualMusicIds") || "")
        .split(/[\s,]+/)
        .map((value) => value.trim())
        .filter(Boolean);
    const musics = Array.from(new Set([...selectedIds, ...manualIds]));

    if (!title) {
        showToast("Album title is required.", "error");
        return;
    }

    if (musics.length === 0) {
        showToast("Select or paste at least one music ID for the album.", "error");
        return;
    }

    try {
        const data = await api("/api/music/album", {
            method: "POST",
            body: JSON.stringify({ title, musics }),
        });

        event.currentTarget.reset();
        renderArtistMusicOptions();
        showToast(data.message || "Album created", "success");
    } catch (error) {
        handleProtectedError(error);
    }
}

async function loadUserLibrary() {
    if (state.user?.role !== "user") {
        renderMusicList();
        renderAlbumList();
        return;
    }

    try {
        const [musicData, albumData] = await Promise.all([
            api("/api/music"),
            api("/api/music/albums"),
        ]);

        state.musics = musicData.musics || [];
        state.albums = albumData.albums || [];
        renderMusicList();
        renderAlbumList();
        renderAlbumDetail();
        showToast("Library refreshed", "success");
    } catch (error) {
        handleProtectedError(error);
    }
}

async function loadAlbumDetail(albumId) {
    try {
        const data = await api(`/api/music/albums/${albumId}`);
        state.selectedAlbum = data.album || null;
        renderAlbumDetail();
    } catch (error) {
        handleProtectedError(error);
    }
}

function afterAuthChange() {
    renderSession();
    renderArtistMusicOptions();
    renderArtistMusicList();
    renderMusicList();
    renderAlbumList();
    renderAlbumDetail();

    if (state.user?.role === "user") {
        loadUserLibrary();
    }
}

function clearSession() {
    state.user = null;
    state.musics = [];
    state.albums = [];
    state.selectedAlbum = null;

    localStorage.removeItem(storageKeys.user);
    renderSession();
    renderMusicList();
    renderAlbumList();
    renderAlbumDetail();
}

function renderSession() {
    const user = state.user;

    if (!user) {
        elements.sessionSummary.innerHTML = `
            <strong>Guest</strong>
            <span>Sign in to use the backend.</span>
        `;
        elements.logoutButton.hidden = true;
        elements.guestNote.hidden = false;
        elements.welcomePanel.hidden = false;
        elements.artistPanel.hidden = true;
        elements.userPanel.hidden = true;
        return;
    }

    elements.sessionSummary.innerHTML = `
        <strong>${escapeHtml(user.username)}</strong>
        <span>${escapeHtml(user.email)} • ${escapeHtml(user.role)}</span>
    `;
    elements.logoutButton.hidden = false;
    elements.guestNote.hidden = true;
    elements.welcomePanel.hidden = true;
    elements.artistPanel.hidden = user.role !== "artist";
    elements.userPanel.hidden = user.role !== "user";
}

function renderArtistMusicOptions() {
    if (state.artistMusics.length === 0) {
        elements.albumMusicOptions.className = "option-list empty-state";
        elements.albumMusicOptions.textContent = "Upload a track to start building an album.";
        return;
    }

    elements.albumMusicOptions.className = "option-list";
    elements.albumMusicOptions.innerHTML = state.artistMusics.map((music) => `
        <label class="option-chip">
            <input type="checkbox" name="albumMusic" value="${escapeAttribute(music.id)}">
            <span>
                <strong>${escapeHtml(music.title)}</strong><br>
                <code>${escapeHtml(music.id)}</code>
            </span>
        </label>
    `).join("");
}

function renderArtistMusicList() {
    if (state.artistMusics.length === 0) {
        elements.artistMusicList.className = "card-list empty-state";
        elements.artistMusicList.textContent = "No tracks uploaded from this frontend yet.";
        return;
    }

    elements.artistMusicList.className = "card-list";
    elements.artistMusicList.innerHTML = state.artistMusics.map((music) => `
        <article class="artist-track-card">
            <h4>${escapeHtml(music.title)}</h4>
            <p class="meta-row">Music ID: <code>${escapeHtml(music.id)}</code></p>
            <a href="${escapeAttribute(music.uri)}" target="_blank" rel="noreferrer">Open uploaded file</a>
        </article>
    `).join("");
}

function renderMusicList() {
    if (state.user?.role !== "user") {
        elements.musicList.className = "card-list empty-state";
        elements.musicList.textContent = "Login as a user to load the music catalog.";
        return;
    }

    if (state.musics.length === 0) {
        elements.musicList.className = "card-list empty-state";
        elements.musicList.textContent = "No music found yet.";
        return;
    }

    elements.musicList.className = "card-list";
    elements.musicList.innerHTML = state.musics.map((music) => `
        <article class="music-card">
            <h4>${escapeHtml(music.title)}</h4>
            <p class="meta-row">Artist: ${escapeHtml(music.artist?.username || "Unknown")} • ${escapeHtml(music.artist?.email || "No email")}</p>
            <audio controls src="${escapeAttribute(music.uri)}"></audio>
        </article>
    `).join("");
}

function renderAlbumList() {
    if (state.user?.role !== "user") {
        elements.albumList.className = "card-list empty-state";
        elements.albumList.textContent = "Albums will appear here after user login.";
        return;
    }

    if (state.albums.length === 0) {
        elements.albumList.className = "card-list empty-state";
        elements.albumList.textContent = "No albums found yet.";
        return;
    }

    elements.albumList.className = "card-list";
    elements.albumList.innerHTML = state.albums.map((album) => `
        <article class="album-card">
            <h4>${escapeHtml(album.title)}</h4>
            <p class="meta-row">Artist: ${escapeHtml(album.artist?.username || "Unknown")}</p>
            <button class="ghost-button" type="button" data-album-id="${escapeAttribute(album._id)}">View album</button>
        </article>
    `).join("");
}

function renderAlbumDetail() {
    if (state.user?.role !== "user") {
        elements.albumDetail.className = "detail-card empty-state";
        elements.albumDetail.textContent = "Album details are available for user sessions.";
        return;
    }

    if (!state.selectedAlbum) {
        elements.albumDetail.className = "detail-card empty-state";
        elements.albumDetail.textContent = "Pick an album to load its tracks.";
        return;
    }

    const album = state.selectedAlbum;
    const tracks = Array.isArray(album.musics) ? album.musics : [];

    elements.albumDetail.className = "detail-card";
    elements.albumDetail.innerHTML = `
        <h4>${escapeHtml(album.title || "Untitled album")}</h4>
        <p class="meta-row">Artist: ${escapeHtml(album.artist?.username || "Unknown")} • ${escapeHtml(album.artist?.email || "No email")}</p>
        ${tracks.length === 0 ? "<p class=\"card-copy\">This album does not have tracks yet.</p>" : ""}
        ${tracks.length > 0 ? `
            <ul>
                ${tracks.map((track) => `
                    <li>
                        <strong>${escapeHtml(track.title || "Untitled track")}</strong><br>
                        <code>${escapeHtml(track._id || "")}</code>
                        ${track.uri ? `<audio controls src="${escapeAttribute(track.uri)}"></audio>` : ""}
                    </li>
                `).join("")}
            </ul>
        ` : ""}
    `;
}

async function api(url, options = {}) {
    const isFormData = options.body instanceof FormData;
    const headers = isFormData ? { ...(options.headers || {}) } : {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    const response = await fetch(url, {
        method: options.method || "GET",
        credentials: "include",
        headers,
        body: options.body,
    });

    const raw = await response.text();
    let data = {};

    if (raw) {
        try {
            data = JSON.parse(raw);
        } catch (error) {
            data = { message: raw };
        }
    }

    if (!response.ok) {
        const requestError = new Error(data.message || "Request failed");
        requestError.status = response.status;
        throw requestError;
    }

    return data;
}

function handleProtectedError(error) {
    if (error.status === 401) {
        clearSession();
    }

    showToast(error.message, "error");
}

function showToast(message, tone = "info") {
    clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.className = `toast is-visible ${tone === "success" ? "is-success" : ""} ${tone === "error" ? "is-error" : ""}`.trim();

    toastTimer = window.setTimeout(() => {
        elements.toast.className = "toast";
    }, 2600);
}

function readJson(key, fallback = null) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        return fallback;
    }
}

function persistJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
    return escapeHtml(value);
}
