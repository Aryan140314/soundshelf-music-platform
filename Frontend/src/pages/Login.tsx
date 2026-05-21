import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { storeUser } from "../auth/session";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e:any) => {
    e.preventDefault();
    setError("");

    const payload:any = { password };

    if (identifier.includes("@")) {
      payload.email = identifier;
    } else {
      payload.username = identifier;
    }

    try {
      const response = await api.post("/api/auth/login", payload);
      storeUser(response.data.user);
      navigate("/dashboard");
    } catch (err:any) {
      setError(err?.response?.data?.message ?? "Login failed");
    }
  };

  return (
    <div className="container">
      <form className="card" onSubmit={submit}>
        <h1>Login</h1>
        {error ? <p className="form-error">{error}</p> : null}

        <input
          placeholder="Username or Email"
          value={identifier}
          onChange={(e)=>setIdentifier(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        <p className="form-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
