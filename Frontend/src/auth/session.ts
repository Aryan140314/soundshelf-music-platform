const AUTH_USER_KEY = "pulsebeat_user";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  role: "user" | "artist";
};

export function getStoredUser(): AuthUser | null {
  const storedUser = localStorage.getItem(AUTH_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function storeUser(user: AuthUser) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem(AUTH_USER_KEY);
}
