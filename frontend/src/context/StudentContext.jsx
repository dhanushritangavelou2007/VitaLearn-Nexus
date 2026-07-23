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
  updateStudentAppointments as updateStudentAppointmentsApi,
} from "../services/studentService";
import { calculateDashboardStats, generateHealthSummary, calculateHealthScore } from "../utils/studentAnalytics";
import { useAuth } from "../hooks/useAuth";

export function StudentProvider({ children }) {
  const { user } = useAuth();
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

      // Attach canonical health score to every student record so all
      // dashboards share the same computed value without re-deriving it.
      const mappedStudents = studentPayload.students.map((student) => ({
        ...student,
        healthScore: calculateHealthScore(student), // canonical: 95|75|60|45
      }));

      setStudents(mappedStudents);
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

  useEffect(() => {
    if (user) void Promise.resolve().then(loadData);
  }, [user, loadData]);

  useEffect(() => {
    if (!user) return;
    const timer = setInterval(() => {
      loadData().catch(() => {});
    }, 15000);
    return () => clearInterval(timer);
  }, [user, loadData]);

  // ── Mutations ────────────────────────────────────────────────

  const addStudent = useCallback(async (student) => {
    const created   = await createStudentApi(student);
    const withScore = { ...created, healthScore: calculateHealthScore(created) };
    setStudents((prev) => [withScore, ...prev]);
    return withScore;
  }, []);

  const updateStudent = useCallback(async (id, updates) => {
    const updated   = await updateStudentApi(id, updates);
    const withScore = { ...updated, healthScore: calculateHealthScore(updated) };
    setStudents((prev) =>
      prev.map((s) => (String(s.id) === String(id) ? withScore : s))
    );
    return withScore;
  }, []);

  const deleteStudent = useCallback(async (id) => {
    await deleteStudentApi(id);
    setStudents((prev) => prev.filter((s) => String(s.id) !== String(id)));
    setSelectedStudent((prev) => (String(prev?.id) === String(id) ? null : prev));
  }, []);

  const updateSymptoms = useCallback(
    async (id, symptomReport) => {
      const created = await createSymptomReport({ student: id, ...symptomReport });
      await loadData();
      return created;
    },
    [loadData]
  );

  const updateVitals = useCallback(
    async (id, vitals) => updateStudent(id, { vitals, lastUpdate: "Today" }),
    [updateStudent]
  );

  const updateReports = useCallback(
    async (id, reports) => {
      const payload = Array.isArray(reports) ? reports : [reports];
      const created = await Promise.all(payload.map((r) => createReport({ student: id, ...r })));
      await loadData();
      return created;
    },
    [loadData]
  );

  const createAppointmentRecord = useCallback(
    async (payload) => createAppointment(payload),
    []
  );

  const updateStudentAppointments = useCallback(async (studentId, payload) => {
    const updated   = await updateStudentAppointmentsApi(studentId, payload);
    const withScore = { ...updated, healthScore: calculateHealthScore(updated) };
    setStudents((prev) =>
      prev.map((s) => (String(s.id) === String(studentId) ? withScore : s))
    );
    return withScore;
  }, []);

  const getStudentByStudentId = useCallback(async (id) => {
    const student = await getStudentById(id);
    setSelectedStudent(student);
    return student;
  }, []);

  const getStudentByLocalId = useCallback(
    (id) => students.find((s) => String(s.id) === String(id)),
    [students]
  );

  // ── Memoised Stats ───────────────────────────────────────────

  const dashboardStats = useMemo(() => {
    const localStats = calculateDashboardStats(students);
    if (dashboardSummary) {
      return { ...dashboardSummary, ...localStats, riskDistribution: localStats.riskDistribution };
    }
    return localStats;
  }, [dashboardSummary, students]);

  // ── Context Value ────────────────────────────────────────────

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
      updateStudentAppointments,
      generateHealthSummary,
      calculateDashboardStats: () => dashboardStats,
      dashboardSummary,
      loading,
      error,
      refreshStudents: loadData,
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
      updateStudentAppointments,
      dashboardStats,
      dashboardSummary,
      loading,
      error,
      loadData,
    ]
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}
