import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'

export default function Login({ setUser }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const res = await login(form)
      setUser(res.data.user)
      navigate('/')
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="card">
      <h3>Login</h3>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="username or email" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} />
        <input placeholder="password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button>Login</button>
      </form>
    </div>
  )
}
