import { useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "./authContextValue";
import { authenticate, clearSession, fetchCurrentUser, getRoleHome, getStoredSession, logoutRequest, storeSession } from "../services/authService";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession());
  const [authLoading, setAuthLoading] = useState(Boolean(session?.token));
  const restoredTokenRef = useRef(null);
  const sessionToken = session?.token;
  const sessionUser = session?.user;

  useEffect(() => {
    let active = true;
    async function restore() {
      if (!sessionToken || restoredTokenRef.current === sessionToken) {
        setAuthLoading(false);
        return;
      }

      try {
        const user = await fetchCurrentUser();
        if (!active) return;
        const nextSession = { token: sessionToken, user: user || sessionUser };
        setSession(nextSession);
        storeSession(nextSession);
        restoredTokenRef.current = sessionToken;
      } catch {
        if (!active) return;
        setSession(null);
        clearSession();
      } finally {
        if (active) setAuthLoading(false);
      }
    }

    restore();

    return () => {
      active = false;
    };
  }, [sessionToken, sessionUser]);

  useEffect(() => {
    if (!session) {
      clearSession();
      return;
    }
    storeSession(session);
  }, [session]);

  const login = async (email, password, rememberMe = true) => {
    const authSession = await authenticate(email, password);
    const nextSession = { ...authSession, rememberMe };
    setSession(nextSession);
    storeSession(nextSession);
    return nextSession;
  };

  const logout = async () => {
    await logoutRequest();
    setSession(null);
    clearSession();
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      isAuthenticated: Boolean(session?.user),
      role: session?.user?.role || null,
      authLoading,
      login,
      logout,
      getRoleHome,
    }),
    [session, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
