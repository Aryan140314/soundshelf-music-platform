import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { storeUser } from "../auth/session";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e:any) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/api/auth/register", form);
      storeUser(response.data.user);
      navigate("/dashboard");
    } catch (err:any) {
      setError(err?.response?.data?.message ?? "Registration failed");
    }
  };

  return (
    <div className="container">
      <form className="card" onSubmit={submit}>
        <h1>Register</h1>
        {error ? <p className="form-error">{error}</p> : null}

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

        <p className="form-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
