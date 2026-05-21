import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api'

export default function Register({ setUser }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' })
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const res = await register(form)
      setUser(res.data.user)
      navigate('/')
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="card">
      <h3>Register</h3>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} />
        <input placeholder="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input placeholder="password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
          <option value="user">User</option>
          <option value="artist">Artist</option>
        </select>
        <button>Register</button>
      </form>
    </div>
  )
}
