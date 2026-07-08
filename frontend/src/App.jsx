import { Navigate, Routes, Route, useParams } from "react-router-dom";
import Dashboard from "./pages/teacher/Dashboard";
import Students from "./pages/teacher/Students";
import CreatePassport from "./pages/teacher/CreatePassport";
import StudentProfile from "./pages/teacher/StudentProfile";
import ReportSymptoms from "./pages/teacher/ReportSymptoms";
import Reports from "./pages/teacher/Reports";
import Settings from "./pages/teacher/Settings";
import DoctorDashboard from "./pages/doctor/Dashboard";
import ParentDashboard from "./pages/parent/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import Login from "./pages/auth/Login";
import Unauthorized from "./pages/auth/Unauthorized";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleGuard from "./routes/RoleGuard";
import { useAuth } from "./hooks/useAuth";

function IndexRedirect() {
  const { isAuthenticated, role, getRoleHome } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getRoleHome(role)} replace />;
}

function LegacyStudentProfileRedirect() {
  const { id } = useParams();
  return <Navigate to={`/teacher/student-profile/${id || 1}`} replace />;
}

function LegacyStudentSymptomRedirect() {
  const { id } = useParams();
  return <Navigate to={`/teacher/report-symptoms/${id || 1}`} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/teacher/dashboard" element={<RoleGuard role="teacher"><Dashboard /></RoleGuard>} />
        <Route path="/teacher/students" element={<RoleGuard role="teacher"><Students /></RoleGuard>} />
        <Route path="/teacher/create-passport" element={<RoleGuard role="teacher"><CreatePassport /></RoleGuard>} />
        <Route path="/teacher/student-profile/:id" element={<RoleGuard role="teacher"><StudentProfile /></RoleGuard>} />
        <Route path="/teacher/report-symptoms/:id" element={<RoleGuard role="teacher"><ReportSymptoms /></RoleGuard>} />
        <Route path="/teacher/reports" element={<RoleGuard role="teacher"><Reports /></RoleGuard>} />
        <Route path="/settings" element={<Settings />} />

        <Route path="/doctor/dashboard" element={<RoleGuard role="doctor"><DoctorDashboard /></RoleGuard>} />
        <Route path="/parent/dashboard" element={<RoleGuard role="parent"><ParentDashboard /></RoleGuard>} />
        <Route path="/student/dashboard" element={<RoleGuard role="student"><StudentDashboard /></RoleGuard>} />
        <Route path="/admin/dashboard" element={<RoleGuard role="admin"><AdminDashboard /></RoleGuard>} />

        <Route path="/students" element={<Navigate to="/teacher/students" replace />} />
        <Route path="/students/create-passport" element={<Navigate to="/teacher/create-passport" replace />} />
        <Route path="/students/:id" element={<LegacyStudentProfileRedirect />} />
        <Route path="/students/:id/report-symptoms" element={<LegacyStudentSymptomRedirect />} />
        <Route path="/reports" element={<Navigate to="/teacher/reports" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
