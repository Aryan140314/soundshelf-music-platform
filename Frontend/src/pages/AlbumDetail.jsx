import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAlbumById } from '../api'
import MusicCard from '../components/MusicCard'

export default function AlbumDetail(){
  const { id } = useParams()
  const [album, setAlbum] = useState(null)

  useEffect(()=>{fetchAlbum()},[id])

  async function fetchAlbum(){
    try{
      const res = await getAlbumById(id)
      setAlbum(res.data.album)
    }catch(err){console.error(err)}
  }

  if(!album) return <div className="card">Loading...</div>

  return (
    <div>
      <h2>{album.title}</h2>
      <div className="muted">By {album.artist?.username}</div>
      <div className="grid" style={{marginTop:12}}>
        {album.musics?.map(m => <MusicCard key={m._id} music={m} />)}
      </div>
    </div>
  )
}
