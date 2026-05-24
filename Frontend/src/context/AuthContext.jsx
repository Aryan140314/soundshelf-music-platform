import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../services/api";
import {
  clearStoredArtistState,
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from "../utils/storage";
import { useToastContext } from "./ToastContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const toast = useToastContext();
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    setBootstrapping(false);
  }, []);

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    setStoredUser(nextUser);
  }, []);

  const register = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const { data } = await api.post("/auth/register", payload);
        persistUser(data.user);
        toast.success("Welcome to SoundShelf", "Your account is ready and you're signed in.");
        return data.user;
      } catch (error) {
        toast.error("Registration failed", error.friendlyMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [persistUser, toast]
  );

  const login = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const { data } = await api.post("/auth/login", payload);
        persistUser(data.user);
        toast.success("Signed in", `Welcome back, ${data.user.username}.`);
        return data.user;
      } catch (error) {
        toast.error("Login failed", error.friendlyMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [persistUser, toast]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout");
      clearStoredUser();
      clearStoredArtistState();
      setUser(null);
      toast.info("Signed out", "Your session has been closed.");
    } catch (error) {
      clearStoredUser();
      clearStoredArtistState();
      setUser(null);
      toast.info("Signed out locally", "Your local session was cleared.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(user),
      loading,
      bootstrapping,
      login,
      register,
      logout,
      setUser: persistUser,
    }),
    [bootstrapping, loading, login, logout, persistUser, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}
