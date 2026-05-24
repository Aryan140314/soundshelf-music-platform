import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AppLayout from "../layouts/AppLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import ExplorePage from "../pages/ExplorePage";
import AlbumsPage from "../pages/AlbumsPage";
import AlbumDetailsPage from "../pages/AlbumDetailsPage";
import ArtistsPage from "../pages/ArtistsPage";
import ArtistDashboardPage from "../pages/ArtistDashboardPage";
import CreateAlbumPage from "../pages/CreateAlbumPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";
import { useAuth } from "../hooks/useAuth";

function AuthRedirect({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthRedirect>
            <LoginPage />
          </AuthRedirect>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRedirect>
            <RegisterPage />
          </AuthRedirect>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/albums/:albumId" element={<AlbumDetailsPage />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["artist"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/artist/upload" element={<ArtistDashboardPage />} />
          <Route path="/artist/albums/new" element={<CreateAlbumPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
