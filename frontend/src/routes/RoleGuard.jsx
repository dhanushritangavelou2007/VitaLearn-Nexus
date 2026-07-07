import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getRoleHome } from "../services/authService";

function RoleGuard({ role, children }) {
  const { role: currentRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (currentRole !== role) {
    return <Navigate to={getRoleHome(currentRole)} replace />;
  }

  return children;
}

export default RoleGuard;

