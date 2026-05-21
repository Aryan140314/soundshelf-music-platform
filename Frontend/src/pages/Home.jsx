import React, { useEffect, useState } from 'react'
import { getMusics } from '../api'
import MusicCard from '../components/MusicCard'

export default function Home() {
  const [musics, setMusics] = useState([])

  useEffect(() => {
    fetchMusics()
  }, [])

  async function fetchMusics() {
    try {
      const res = await getMusics()
      setMusics(res.data.musics || [])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h2>Latest Musics</h2>
      <div className="grid">
        {musics.map(m => <MusicCard key={m._id} music={m} />)}
      </div>
    </div>
  )
}
