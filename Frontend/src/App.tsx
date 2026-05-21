import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { getStoredUser } from "./auth/session";

function GuestRoute({ children }: { children: JSX.Element }) {
  const user = getStoredUser();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = getStoredUser();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const user = getStoredUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
