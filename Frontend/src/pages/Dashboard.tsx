import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { clearStoredUser, getStoredUser } from "../auth/session";

export default function Dashboard() {
  const user = getStoredUser();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const logout = async () => {
    setError("");

    try {
      await api.post("/api/auth/logout");
    } catch (err:any) {
      setError(err?.response?.data?.message ?? "Logout failed");
      return;
    }

    clearStoredUser();
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="card">
        <h1>PulseBeat Dashboard</h1>
        <p>Welcome {user?.username}. Frontend connected to Express backend.</p>
        <p className="user-role">Role: {user?.role}</p>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="actions">
          <Link className="button-link" to="/login">Login</Link>
          <Link className="button-link secondary" to="/register">Register</Link>
        </div>
        <button type="button" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
