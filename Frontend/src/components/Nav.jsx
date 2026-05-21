import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../api'

export default function Nav({ user, setUser }) {
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      setUser(null)
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <nav className="nav">
      <div>
        <Link to="/">MusicApp</Link>
        <Link to="/albums">Albums</Link>
      </div>
      <div>
        {user ? (
          <>
            <span className="muted">{user.username}</span>
            <button onClick={handleLogout} style={{marginLeft:8}}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        <Link to="/artist" style={{marginLeft:12}}>Artist</Link>
      </div>
    </nav>
  )
}
