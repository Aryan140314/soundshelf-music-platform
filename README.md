# SoundShelf Music Platform

Full-stack music platform with an Express and MongoDB backend, cookie-based authentication, role-based access control, artist uploads, album creation, and a separate frontend served by the backend.

## Overview

This project is built around two user roles:

- `artist`: can upload music files and create albums
- `user`: can browse all uploaded music, view albums, and open album details

The backend handles authentication using a cookie named `token`, and the frontend is served statically from the `Frontend/` folder so both the UI and API work from the same origin.

## Features

- User registration and login
- Cookie-based authentication with JWT
- Role-based route protection
- Artist-only music upload
- Artist-only album creation
- User-only music catalog browsing
- User-only album listing and album detail view
- Frontend and backend separated into dedicated folders

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- multer
- ImageKit

### Frontend

- HTML
- CSS
- Vanilla JavaScript

## Project Structure

```text
project_part 4/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── app.js
│       ├── controllers/
│       ├── db/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── services/
├── Frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
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

## Frontend Behavior

The frontend was built to match the backend rules exactly.

### Guest View

- shows login and registration forms
- explains available roles
- lists available API groups

### Artist View

- upload a music file and title
- create albums
- select tracks uploaded during the current browser session
- manually paste music IDs when needed

### User View

- fetch all music
- fetch all albums
- open album details
- play audio from uploaded track URLs

## Important Backend Constraints

- There is no dedicated endpoint for an artist to fetch all of their existing uploads
- Because of that, the frontend keeps artist uploads in browser state for quick album creation
- The album form also supports manual music ID entry for tracks created earlier

## Environment Variables

Create a file named `backend/.env` and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Aryan140314/soundshelf-music-platform.git
cd soundshelf-music-platform
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create `backend/.env` using `backend/.env.example` as a reference.

### 4. Start the backend server

```bash
npm run dev
```

Or:

```bash
npm start
```

### 5. Open the app

Visit:

```text
http://localhost:3000
```

## Scripts

From the `backend/` folder:

```bash
npm run dev
npm start
```

## Deployment Notes

- The frontend is served statically by Express
- Authentication depends on cookies
- Image uploads require a working ImageKit private key
- MongoDB must be reachable through the `MONGO_URI`

## Security Notes

- Never commit real `.env` files
- Never commit API secrets or database credentials
- Use `.env.example` to show required configuration

## Known Improvement Opportunities

- Add a `GET /api/auth/me` endpoint
- Add an artist library endpoint to fetch their uploaded tracks
- Add input validation and centralized error middleware
- Add pagination, search, and sorting on the backend
- Add automated tests for controllers and middleware

## Repository

GitHub:

`https://github.com/Aryan140314/soundshelf-music-platform`
