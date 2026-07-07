import { Navigate, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/teacher/Dashboard";
import Students from "./pages/teacher/Students";
import CreatePassport from "./pages/teacher/CreatePassport";
import StudentProfile from "./pages/teacher/StudentProfile";
import ReportSymptoms from "./pages/teacher/ReportSymptoms";
import Reports from "./pages/teacher/Reports";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/teacher/dashboard" replace />} />
      <Route path="/teacher/dashboard" element={<Dashboard />} />
      <Route path="/teacher/students" element={<Students />} />
      <Route path="/teacher/create-passport" element={<CreatePassport />} />
      <Route path="/teacher/student-profile/:id" element={<StudentProfile />} />
      <Route path="/teacher/report-symptoms/:id" element={<ReportSymptoms />} />
      <Route path="/teacher/reports" element={<Reports />} />

      <Route path="/students" element={<Navigate to="/teacher/students" replace />} />
      <Route path="/students/create-passport" element={<Navigate to="/teacher/create-passport" replace />} />
      <Route path="/students/:id" element={<StudentProfile />} />
      <Route path="/students/:id/report-symptoms" element={<ReportSymptoms />} />
      <Route path="/reports" element={<Navigate to="/teacher/reports" replace />} />
    </Routes>
  );
}

export default App;
