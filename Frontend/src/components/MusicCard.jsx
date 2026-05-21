import React from 'react'

export default function MusicCard({ music }) {
  return (
    <div className="card">
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{flex:1}}>
          <div style={{fontWeight:600}}>{music.title}</div>
          <div className="muted">{music.artist?.username || 'Unknown'}</div>
        </div>
        <audio controls src={music.uri} />
      </div>
    </div>
  )
}
