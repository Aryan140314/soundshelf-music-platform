import { useState } from "react";
import api from "../api/client";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });

  const submit = async (e:any) => {
    e.preventDefault();
    await api.post("/api/auth/register", form);
    alert("Registered");
  };

  return (
    <div className="container">
      <form className="card" onSubmit={submit}>
        <h1>Register</h1>

        <input
          placeholder="Username"
          value={form.username}
          onChange={(e)=>setForm({...form, username:e.target.value})}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e)=>setForm({...form, email:e.target.value})}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e)=>setForm({...form, password:e.target.value})}
        />

        <select
          value={form.role}
          onChange={(e)=>setForm({...form, role:e.target.value})}
        >
          <option value="user">User</option>
          <option value="artist">Artist</option>
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}