import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContextValue";
import { authenticate, clearSession, getRoleHome, getStoredSession, storeSession } from "../services/authService";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession());

  useEffect(() => {
    if (session) {
      storeSession(session);
    } else {
      clearSession();
    }
  }, [session]);

  const login = (email, password, rememberMe = true) => {
    const authSession = authenticate(email, password);
    const nextSession = { ...authSession, rememberMe };
    setSession(nextSession);
    if (!rememberMe) {
      clearSession();
    } else {
      storeSession(nextSession);
    }
    return nextSession;
  };

  const logout = () => {
    setSession(null);
    clearSession();
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      isAuthenticated: Boolean(session?.user),
      role: session?.user?.role || null,
      login,
      logout,
      getRoleHome,
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

