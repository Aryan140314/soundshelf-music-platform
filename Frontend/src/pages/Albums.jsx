import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAlbums } from '../api'

export default function Albums() {
  const [albums, setAlbums] = useState([])

  useEffect(()=>{fetchAlbums()},[])

  async function fetchAlbums(){
    try{
      const res = await getAlbums()
      setAlbums(res.data.albums || [])
    }catch(err){console.error(err)}
  }

  return (
    <div>
      <h2>Albums</h2>
      <div className="grid">
        {albums.map(a=> (
          <div key={a._id} className="card">
            <div style={{fontWeight:600}}>{a.title}</div>
            <div className="muted">{a.artist?.username}</div>
            <Link to={`/albums/${a._id}`}>Open</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
