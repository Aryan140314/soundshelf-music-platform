# SoundShelf Music Platform

Full-stack music streaming platform with an Express and MongoDB backend, cookie-based JWT authentication, role-based access control, artist uploads, album management, and a modern React frontend with Vite bundler and Tailwind CSS styling.

## Overview

This project is built around two user roles:

- `artist`: can upload music files, create albums, and manage their library
- `user`: can browse all uploaded music, explore artists, view albums, create playlists, and play tracks

The backend handles authentication using secure JWT cookies, and the frontend is a modern React SPA with real-time UI updates, context-based state management, and responsive design using Tailwind CSS.

## Features

- User registration and login with role-based setup
- Secure cookie-based JWT authentication
- Role-based route protection (artist vs user)
- Artist dashboard for music and album management
- Music upload with metadata (title, cover art)
- Album creation and management for artists
- Music catalog browsing and exploration for users
- Album details view with track listing and artist info
- Built-in audio player with playlist support
- Artist profile pages
- Responsive design with Tailwind CSS
- Toast notifications for user feedback
- Loading skeletons for better UX
- Context-based state management (Auth, Music, Toast)
- Protected routes with role-based access control

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- multer (file uploads)
- ImageKit (media storage)

### Frontend

- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (routing)
- Context API (state management)
- Custom Hooks (useAuth, useMusic, useToast)

## Project Structure

```
project_part_4/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── app.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── music.controller.js
│       ├── db/
│       │   └── db.js
│       ├── middlewares/
│       │   └── auth.middleware.js
│       ├── models/
│       │   ├── album.model.js
│       │   ├── music.model.js
│       │   └── user.model.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── music.routes.js
│       └── services/
│           └── storage.service.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── components/
│       │   ├── AlbumCard.jsx
│       │   ├── Button.jsx
│       │   ├── EmptyState.jsx
│       │   ├── Input.jsx
│       │   ├── Loader.jsx
│       │   ├── Modal.jsx
│       │   ├── MusicCard.jsx
│       │   ├── Navbar.jsx
│       │   ├── Player.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── Sidebar.jsx
│       │   ├── SkeletonCard.jsx
│       │   └── UploadDropzone.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── MusicContext.jsx
│       │   └── ToastContext.jsx
│       ├── hooks/
│       │   ├── useAuth.js
│       │   ├── useMusic.js
│       │   └── useToast.js
│       ├── layouts/
│       │   └── AppLayout.jsx
│       ├── pages/
│       │   ├── AlbumDetailsPage.jsx
│       │   ├── AlbumsPage.jsx
│       │   ├── ArtistDashboardPage.jsx
│       │   ├── ArtistsPage.jsx
│       │   ├── CreateAlbumPage.jsx
│       │   ├── ExplorePage.jsx
│       │   ├── HomePage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── NotFoundPage.jsx
│       │   ├── ProfilePage.jsx
│       │   └── RegisterPage.jsx
│       ├── routes/
│       │   └── AppRouter.jsx
│       ├── services/
│       │   └── api.js
│       ├── styles/
│       │   └── global.css
│       ├── utils/
│       │   ├── cn.js
│       │   ├── formatters.js
│       │   └── storage.js
│       └── assets/
└── README.md
```

## Backend Architecture

### Entry Files

- `backend/server.js`
  - loads environment variables
  - connects to MongoDB
  - starts the Express server on port `3000`

- `backend/src/app.js`
  - configures Express middleware
  - enables JSON parsing and cookie parsing
  - mounts auth and music routes
  - serves the frontend from the `Frontend/` folder

### Database Models

#### User

- `username`
- `email`
- `password`
- `role`: `user` or `artist`

#### Music

- `uri`
- `title`
- `artist`

#### Album

- `title`
- `musics[]`
- `artist`

### Authentication Flow

- Register and login both return user data and set a cookie named `token`
- Protected routes read the JWT from cookies
- Artist routes require `role = artist`
- User routes require `role = user`

## API Reference

Base URL:

```text
http://localhost:3000
```

### Auth Routes

#### `POST /api/auth/register`

Registers a new account.

Request body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "user"
}
```

Success response:

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email@example.com",
    "role": "user"
  }
}
```

#### `POST /api/auth/login`

Logs in an existing account using either `username` or `email`.

Request body examples:

```json
{
  "username": "artist01",
  "password": "secret123"
}
```

```json
{
  "email": "artist@example.com",
  "password": "secret123"
}
```

Success response:

```json
{
  "message": "User logged in successfully",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email@example.com",
    "role": "artist"
  }
}
```

#### `POST /api/auth/logout`

Clears the auth cookie.

Success response:

```json
{
  "message": "User logged out successfully"
}
```

### Music Routes

#### `POST /api/music/upload`

Artist-only route for music upload.

Request type:

```text
multipart/form-data
```

Fields:

- `title`
- `music`

Success response:

```json
{
  "message": "Music created successfully",
  "music": {
    "id": "music_id",
    "uri": "https://your-file-url",
    "title": "My Track",
    "artist": "artist_user_id"
  }
}
```

#### `POST /api/music/album`

Artist-only route for album creation.

Request body:

```json
{
  "title": "My Album",
  "musics": ["music_id_1", "music_id_2"]
}
```

Success response:

```json
{
  "message": "Album created successfully",
  "album": {
    "id": "album_id",
    "title": "My Album",
    "artist": "artist_user_id",
    "musics": ["music_id_1", "music_id_2"]
  }
}
```

#### `GET /api/music`

User-only route for fetching all music.

Success response:

```json
{
  "message": "Musics fetched successfully",
  "musics": [
    {
      "_id": "music_id",
      "uri": "https://your-file-url",
      "title": "My Track",
      "artist": {
        "_id": "artist_id",
        "username": "artist01",
        "email": "artist@example.com"
      }
    }
  ]
}
```

#### `GET /api/music/albums`

User-only route for fetching all albums.

Success response:

```json
{
  "message": "Albums fetched successfully",
  "albums": [
    {
      "_id": "album_id",
      "title": "Album Title",
      "artist": {
        "_id": "artist_id",
        "username": "artist01",
        "email": "artist@example.com"
      }
    }
  ]
}
```

#### `GET /api/music/albums/:albumId`

User-only route for fetching a single album with populated music tracks.

Success response:

```json
{
  "message": "Album fetched successfully",
  "album": {
    "_id": "album_id",
    "title": "Album Title",
    "artist": {
      "_id": "artist_id",
      "username": "artist01",
      "email": "artist@example.com"
    },
    "musics": [
      {
        "_id": "music_id",
        "title": "Track Title",
        "uri": "https://your-file-url",
        "artist": "artist_id"
      }
    ]
  }
}
```

## Frontend Architecture

### Pages

- **HomePage**: Main landing page for authenticated users
- **LoginPage**: User login form
- **RegisterPage**: User registration with role selection
- **ArtistDashboardPage**: Artist control panel for uploads and album management
- **AlbumsPage**: Browse and view all albums
- **AlbumDetailsPage**: Detailed album view with track listing
- **ArtistsPage**: Browse all artists
- **CreateAlbumPage**: Album creation interface for artists
- **ExplorePage**: Explore music and artists
- **ProfilePage**: User profile information

### Components

- **Navbar**: Navigation bar with user menu
- **Sidebar**: Navigation sidebar
- **Player**: Audio player with playback controls
- **AlbumCard**: Album display card
- **MusicCard**: Music track display card
- **Button**: Reusable button component
- **Input**: Reusable input field component
- **Modal**: Dialog component for confirmations
- **UploadDropzone**: Drag-and-drop file upload area
- **ProtectedRoute**: Route guard for authenticated users
- **SkeletonCard**: Loading placeholder
- **EmptyState**: Empty state message component
- **Loader**: Loading spinner component

### State Management

**AuthContext**: Manages user authentication state, login, logout, and role information

**MusicContext**: Manages music catalog, albums, and artist data

**ToastContext**: Manages toast notifications for user feedback

### Custom Hooks

- `useAuth()`: Access authentication state and methods
- `useMusic()`: Access music data and methods
- `useToast()`: Display toast notifications

## Frontend Behavior

### Authentication Flow

1. Unauthenticated users see login/register forms
2. Users can register as either "artist" or "user"
3. After login, JWT token is stored in cookies
4. Protected routes require valid authentication
5. Role-based UI adjustments based on user type

### Artist Features

- Upload music files with title and cover art
- Create albums from uploaded tracks
- Manage artist dashboard
- View artist profile
- Browse other artists on platform

### User Features

- Browse music catalog
- View album details with full track listings
- Play audio tracks directly from URLs
- Search and explore artists
- View user profile
- Navigate through albums and music collections

## Important Backend Constraints

- There is no dedicated endpoint for an artist to fetch all of their existing uploads
- Because of that, the frontend keeps artist uploads in browser state for quick album creation
- The album form also supports manual music ID entry for tracks created earlier

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Aryan140314/soundshelf-music-platform.git
cd soundshelf-music-platform
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env` file with your configuration:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
PORT=3000
```

Start the backend server:

```bash
npm run dev
```

or

```bash
npm start
```

### 3. Frontend Setup

In a new terminal, from the project root:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will open at `http://localhost:5173` by default (Vite's default port).

### 4. Access the Application

- **Backend API**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **Production**: Backend serves the built frontend when deployed

## Available Scripts

### Backend Scripts

From the `backend/` folder:

```bash
npm run dev        # Start development server with hot reload
npm start          # Start production server
npm run build      # Build for production
```

### Frontend Scripts

From the `frontend/` folder:

```bash
npm run dev        # Start Vite development server
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run lint       # Run linter (if configured)
```

## Deployment Notes

- Build the React frontend: `cd frontend && npm run build`
- The built frontend is deployed with the backend
- Backend serves the built frontend from the `dist/` directory
- Ensure MongoDB is accessible from your deployment environment
- Set all required environment variables in your hosting platform
- ImageKit credentials must be valid for image uploads to work
- CORS is handled via same-origin policy in production
- JWT secrets should be strong and secure
- Never expose API keys or secrets in version control

## Security Notes

- Never commit `.env` files - use `.env.example` as a template
- Store API secrets securely in environment variables
- JWT secrets should be strong and unique
- Passwords are hashed with bcryptjs before storage
- Cookies are used for secure JWT storage
- Protected routes verify user role and authentication
- Use HTTPS in production
- Implement rate limiting for auth endpoints
- Validate all user inputs on backend
- Regular security audits recommended

## Known Improvement Opportunities

- Add pagination and infinite scroll for music catalog
- Implement search functionality across music and artists
- Add user favorites/liked tracks feature
- Add playlist creation and management for users
- Implement sorting options (date, popularity, etc.)
- Add input validation and centralized error handling middleware
- Add comprehensive error boundaries in React frontend
- Implement optimistic updates for better UX
- Add unit and integration tests
- Implement caching strategy for API responses
- Add offline mode support
- Add dark/light theme toggle
- Implement user notifications for new music
- Add analytics tracking
- Consider implementing WebSocket for real-time updates

## Repository

GitHub:

`https://github.com/Aryan140314/soundshelf-music-platform`
