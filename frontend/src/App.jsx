import { Navigate, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/public/LandingPage";
import Dashboard from "./pages/teacher/Dashboard";
import Students from "./pages/teacher/Students";
import CreatePassport from "./pages/teacher/CreatePassport";
import StudentProfile from "./pages/teacher/StudentProfile";
import ReportSymptoms from "./pages/teacher/ReportSymptoms";
import Reports from "./pages/teacher/Reports";
import Settings from "./pages/teacher/Settings";
import ParentDashboard from "./pages/parent/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import DoctorDashboard from "./pages/doctor/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<LandingPage />} />
      <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
      <Route path="/teacher/dashboard" element={<Dashboard />} />
      <Route path="/teacher/students" element={<Students />} />
      <Route path="/teacher/create-passport" element={<CreatePassport />} />
      <Route path="/teacher/student-profile/:id" element={<StudentProfile />} />
      <Route path="/teacher/report-symptoms/:id" element={<ReportSymptoms />} />

      <Route path="/students" element={<Navigate to="/teacher/students" replace />} />
      <Route path="/students/create-passport" element={<Navigate to="/teacher/create-passport" replace />} />
      <Route path="/students/:id" element={<StudentProfile />} />
      <Route path="/students/:id/report-symptoms" element={<ReportSymptoms />} />
      <Route path="/teacher/reports" element={<Reports />} />
      <Route path="/teacher/settings" element={<Settings />} />
      <Route path="/parent/dashboard" element={<ParentDashboard />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
