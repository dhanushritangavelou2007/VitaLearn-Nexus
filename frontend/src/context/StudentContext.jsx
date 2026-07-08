import { useCallback, useEffect, useMemo, useState } from "react";
import { StudentContext } from "./studentContextValue";
import {
  createAppointment,
  createReport,
  createStudent as createStudentApi,
  createSymptomReport,
  deleteStudent as deleteStudentApi,
  getDashboardSummary,
  getStudentById,
  getStudents,
  updateStudent as updateStudentApi,
} from "../services/studentService";
import { calculateDashboardStats, generateHealthSummary } from "../utils/studentAnalytics";

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [studentPayload, summary] = await Promise.all([getStudents(), getDashboardSummary()]);
      setStudents(studentPayload.students);
      setDashboardSummary(summary);
    } catch (err) {
      setError(err.message || "Failed to load student data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, [loadData]);

  const addStudent = useCallback(async (student) => {
    const created = await createStudentApi(student);
    setStudents((current) => [created, ...current]);
    return created;
  }, []);

  const updateStudent = useCallback(async (id, updates) => {
    const updated = await updateStudentApi(id, updates);
    setStudents((current) => current.map((student) => (String(student.id) === String(id) ? updated : student)));
    return updated;
  }, []);

  const deleteStudent = useCallback(async (id) => {
    await deleteStudentApi(id);
    setStudents((current) => current.filter((student) => String(student.id) !== String(id)));
    setSelectedStudent((current) => (String(current?.id) === String(id) ? null : current));
  }, []);

  const updateSymptoms = useCallback(async (id, symptomReport) => {
    const created = await createSymptomReport({ student: id, ...symptomReport });
    await loadData();
    return created;
  }, [loadData]);

  const updateVitals = useCallback(async (id, vitals) => {
    return updateStudent(id, { vitals, lastUpdate: "Today" });
  }, [updateStudent]);

  const updateReports = useCallback(async (id, reports) => {
    const payload = Array.isArray(reports) ? reports : [reports];
    const created = await Promise.all(payload.map((report) => createReport({ student: id, ...report })));
    await loadData();
    return created;
  }, [loadData]);

  const createAppointmentRecord = useCallback(async (payload) => {
    return createAppointment(payload);
  }, []);

  const getStudentByStudentId = useCallback(async (id) => {
    const student = await getStudentById(id);
    setSelectedStudent(student);
    return student;
  }, []);

  const getStudentByLocalId = useCallback((id) => students.find((student) => String(student.id) === String(id)), [students]);

  const dashboardStats = useMemo(() => {
    if (dashboardSummary) return dashboardSummary;
    return calculateDashboardStats(students);
  }, [dashboardSummary, students]);

  const [waterTracker, setWaterTracker] = useState({ intake: 1200, goal: 2000 });
  const [sleepTracker, setSleepTracker] = useState({ hours: 6.5, goal: 8, quality: "Fair" });

  const updateWater = useCallback((amount) => {
    setWaterTracker(prev => ({ ...prev, intake: Math.min(prev.intake + amount, prev.goal) }));
  }, []);

  const updateSleep = useCallback((updates) => {
    setSleepTracker(prev => ({ ...prev, ...updates }));
  }, []);

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
      getStudentById: getStudentByLocalId,
      fetchStudentById: getStudentByStudentId,
      createAppointment: createAppointmentRecord,
      generateHealthSummary,
      calculateDashboardStats: () => dashboardStats,
      dashboardSummary,
      loading,
      error,
      refreshStudents: loadData,
      waterTracker,
      updateWater,
      sleepTracker,
      updateSleep,
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
      getStudentByLocalId,
      getStudentByStudentId,
      createAppointmentRecord,
      dashboardStats,
      dashboardSummary,
      loading,
      error,
      loadData,
      waterTracker,
      updateWater,
      sleepTracker,
      updateSleep,
    ]
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}
