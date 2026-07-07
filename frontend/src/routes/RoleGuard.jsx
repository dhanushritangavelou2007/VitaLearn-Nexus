import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getRoleHome } from "../services/authService";

function RoleGuard({ role, children }) {
  const { role: currentRole, isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-600">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (currentRole !== role) {
    return <Navigate to={getRoleHome(currentRole)} replace />;
  }

  return children;
}

export default RoleGuard;
