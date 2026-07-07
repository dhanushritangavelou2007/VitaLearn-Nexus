import { useCallback, useMemo, useState } from "react";
import { StudentContext } from "./studentContextValue";
import {
  addStudent as addStudentRecord,
  deleteStudent as deleteStudentRecord,
  findStudentById,
  getInitialStudents,
  updateReports as updateStudentReports,
  updateStudent as updateStudentRecord,
  updateSymptoms as updateStudentSymptoms,
  updateVitals as updateStudentVitals,
} from "../services/studentService";
import { calculateDashboardStats, generateHealthSummary } from "../utils/studentAnalytics";

export function StudentProvider({ children }) {
  const [students, setStudents] = useState(() => getInitialStudents());
  const [selectedStudent, setSelectedStudent] = useState(null);

  const addStudent = useCallback((student) => {
    setStudents((current) => addStudentRecord(current, student));
  }, []);

  const updateStudent = useCallback((id, updates) => {
    setStudents((current) => updateStudentRecord(current, id, updates));
  }, []);

  const deleteStudent = useCallback((id) => {
    setStudents((current) => deleteStudentRecord(current, id));
    setSelectedStudent((current) => (String(current?.id) === String(id) ? null : current));
  }, []);

  const updateSymptoms = useCallback((id, symptomReport) => {
    setStudents((current) => updateStudentSymptoms(current, id, symptomReport));
  }, []);

  const updateVitals = useCallback((id, vitals) => {
    setStudents((current) => updateStudentVitals(current, id, vitals));
  }, []);

  const updateReports = useCallback((id, reports) => {
    setStudents((current) => updateStudentReports(current, id, reports));
  }, []);

  const getStudentById = useCallback((id) => findStudentById(students, id), [students]);

  const value = useMemo(
    () => ({
      students,
      selectedStudent,
      setSelectedStudent,
      addStudent,
      updateStudent,
      deleteStudent,
      updateSymptoms,
      updateVitals,
      updateReports,
      getStudentById,
      generateHealthSummary,
      calculateDashboardStats: () => calculateDashboardStats(students),
    }),
    [
      students,
      selectedStudent,
      addStudent,
      updateStudent,
      deleteStudent,
      updateSymptoms,
      updateVitals,
      updateReports,
      getStudentById,
    ]
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}
