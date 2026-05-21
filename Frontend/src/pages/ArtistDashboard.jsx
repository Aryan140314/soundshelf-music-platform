import React, { useState } from 'react'
import { uploadMusic, createAlbum } from '../api'

export default function ArtistDashboard(){
  const [musicForm, setMusicForm] = useState({ title: '' })
  const [file, setFile] = useState(null)
  const [albumForm, setAlbumForm] = useState({ title: '', musics: '' })

  async function handleUpload(e){
    e.preventDefault()
    if(!file){alert('Select a file');return}
    const fd = new FormData()
    fd.append('music', file)
    fd.append('title', musicForm.title)
    try{
      await uploadMusic(fd)
      alert('Uploaded')
    }catch(err){console.error(err);alert('Upload failed')}
  }

  async function handleCreateAlbum(e){
    e.preventDefault()
    try{
      const musics = albumForm.musics.split(',').map(s=>s.trim()).filter(Boolean)
      await createAlbum({ title: albumForm.title, musics })
      alert('Album created')
    }catch(err){console.error(err);alert('Create album failed')}
  }

  return (
    <div>
      <h2>Artist Dashboard</h2>
      <div className="card">
        <h4>Upload Music</h4>
        <form className="form" onSubmit={handleUpload}>
          <input placeholder="Title" value={musicForm.title} onChange={e=>setMusicForm({...musicForm,title:e.target.value})} />
          <input type="file" accept="audio/*" onChange={e=>setFile(e.target.files[0])} />
          <button>Upload</button>
        </form>
      </div>

      <div className="card">
        <h4>Create Album</h4>
        <form className="form" onSubmit={handleCreateAlbum}>
          <input placeholder="Album Title" value={albumForm.title} onChange={e=>setAlbumForm({...albumForm,title:e.target.value})} />
          <input placeholder="Music IDs (comma separated)" value={albumForm.musics} onChange={e=>setAlbumForm({...albumForm,musics:e.target.value})} />
          <button>Create Album</button>
        </form>
      </div>
    </div>
  )
}
