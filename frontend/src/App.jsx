import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/teacher/Dashboard";
import Students from "./pages/teacher/Students";
import StudentProfile from "./pages/teacher/StudentProfile";
import CreatePassport from "./pages/teacher/CreatePassport";
import ReportSymptoms from "./pages/teacher/ReportSymptoms";

function App() {
  return (
    <Routes>

      {/* Default Route */}

      <Route
        path="/"
        element={<Navigate to="/teacher/dashboard" replace />}
      />

      {/* Teacher Routes */}

      <Route
        path="/teacher/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/teacher/students"
        element={<Students />}
      />

      <Route
  path="/teacher/student-profile/:id"
  element={<StudentProfile />}
/>

<Route
  path="/teacher/report-symptoms/:id"
  element={<ReportSymptoms />}
/>

      <Route
        path="/teacher/create-passport"
        element={<CreatePassport />}
      />

      

    </Routes>
  );
}

export default App;