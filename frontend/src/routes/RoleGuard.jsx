import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getRoleHome } from "../services/authService";

function RoleGuard({ role, children }) {
  const { role: currentRole, isAuthenticated, authLoading, getRoleHome } = useAuth();

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-600">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = Array.isArray(role) ? role : [role];
  if (!allowedRoles.includes(currentRole)) {
    return <Navigate to={getRoleHome(currentRole)} replace />;
  }

  return children;
}

export default RoleGuard;
