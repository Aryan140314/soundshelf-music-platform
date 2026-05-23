import { useState } from "react";
import api from "../api/client";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e:any) => {
    e.preventDefault();

    const payload:any = { password };

    if (identifier.includes("@")) {
      payload.email = identifier;
    } else {
      payload.username = identifier;
    }

    await api.post("/api/auth/login", payload);
    alert("Login successful");
  };

  return (
    <div className="container">
      <form className="card" onSubmit={submit}>
        <h1>Login</h1>

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
      </form>
    </div>
  );
}