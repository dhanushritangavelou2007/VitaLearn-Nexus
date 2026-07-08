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
  return <Navigate to={`/passport/${id || 1}`} replace />;
}

function LegacyStudentSymptomRedirect() {
  const { id } = useParams();
  return <Navigate to={`/report-symptoms/${id || 1}`} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        {/* Dashboards */}
        <Route path="/teacher/dashboard" element={<RoleGuard role="teacher"><Dashboard /></RoleGuard>} />
        <Route path="/doctor/dashboard" element={<RoleGuard role="doctor"><DoctorDashboard /></RoleGuard>} />
        <Route path="/parent/dashboard" element={<RoleGuard role="parent"><ParentDashboard /></RoleGuard>} />
        <Route path="/student/dashboard" element={<RoleGuard role="student"><StudentDashboard /></RoleGuard>} />
        <Route path="/admin/dashboard" element={<RoleGuard role="admin"><AdminDashboard /></RoleGuard>} />

        {/* Shared Routes */}
        <Route path="/students" element={<RoleGuard role={["teacher", "doctor", "admin"]}><Students /></RoleGuard>} />
        <Route path="/create-passport" element={<RoleGuard role="teacher"><CreatePassport /></RoleGuard>} />
        <Route path="/passport/:id" element={<RoleGuard role={["teacher", "doctor", "parent", "student", "admin"]}><StudentProfile /></RoleGuard>} />
        <Route path="/report-symptoms/:id" element={<RoleGuard role={["teacher", "doctor"]}><ReportSymptoms /></RoleGuard>} />
        <Route path="/reports" element={<RoleGuard role={["teacher", "doctor", "parent", "student", "admin"]}><Reports /></RoleGuard>} />
        
        <Route path="/settings" element={<Settings />} />

        {/* Legacy Redirects (keep them just in case old links exist) */}
        <Route path="/teacher/students" element={<Navigate to="/students" replace />} />
        <Route path="/teacher/create-passport" element={<Navigate to="/create-passport" replace />} />
        <Route path="/teacher/student-profile/:id" element={<LegacyStudentProfileRedirect />} />
        <Route path="/teacher/report-symptoms/:id" element={<LegacyStudentSymptomRedirect />} />
        <Route path="/teacher/reports" element={<Navigate to="/reports" replace />} />
        <Route path="/students/create-passport" element={<Navigate to="/create-passport" replace />} />
        <Route path="/students/:id" element={<LegacyStudentProfileRedirect />} />
        <Route path="/students/:id/report-symptoms" element={<LegacyStudentSymptomRedirect />} />
      </Route>
    </Routes>
  );
}

export default App;
