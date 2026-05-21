import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Albums from './pages/Albums'
import AlbumDetail from './pages/AlbumDetail'
import ArtistDashboard from './pages/ArtistDashboard'

export default function App() {
  const [user, setUser] = useState(null)

  return (
    <div className="app-root">
      <Nav user={user} setUser={setUser} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/albums/:id" element={<AlbumDetail />} />
          <Route path="/artist" element={<ArtistDashboard />} />
        </Routes>
      </main>
    </div>
  )
}
