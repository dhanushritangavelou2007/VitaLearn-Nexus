import { getRepository } from "../repositories/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { listStudents, getStudentById as getStudentServiceById, updateStudent as updateStudentService } from "../services/studentService.js";
import { createNotification } from "../services/notificationService.js";

export const getStudents = asyncHandler(async (req, res) => {
  const { items, pagination } = await listStudents(req.query, req.user);
  res.json({ success: true, data: items, pagination });
});

export const getStudentById = asyncHandler(async (req, res, next) => {
  const student = await getStudentServiceById(req.params.id);
  if (!student) return next(new AppError("Student not found", 404));
  res.json({ success: true, data: student });
});

export const createStudent = asyncHandler(async (req, res) => {
  const repo = getRepository("Student");
  const student = await repo.create(req.body);
  res.status(201).json({ success: true, data: student });
});

export const updateStudent = asyncHandler(async (req, res, next) => {
  const student = await updateStudentService(req.params.id, req.body);
  if (!student) return next(new AppError("Student not found", 404));
  res.json({ success: true, data: student });
});

export const updateStudentAppointments = asyncHandler(async (req, res, next) => {
  const repo = getRepository("Student");
  const student = await repo.findById(req.params.id);
  if (!student) return next(new AppError("Student not found", 404));

  const { appointmentId, status, consent } = req.body;
  const appointments = (student.appointments || []).map((item) =>
    item.id === appointmentId
      ? {
          ...item,
          status: status || item.status,
          consent: consent || item.consent,
          confirmedAt: status === "confirmed" || consent === "accepted" ? new Date().toISOString() : item.confirmedAt,
        }
      : item
  );

  const updated = await repo.findByIdAndUpdate(req.params.id, { appointments });

  if (consent === "accepted") {
    const UserRepo = getRepository("User");
    const doctors = await UserRepo.find({ role: "doctor" });
    for (const doc of doctors) {
      await createNotification({
        recipient: doc._id || doc.id,
        title: `Appointment Accepted: ${student.name}`,
        message: `Parent has consented to the upcoming appointment.`,
        type: "appointment-accepted",
        metadata: { 
          studentId: String(student._id || student.id),
          recipientRole: "doctor"
        }
      });
    }
  }

  res.json({ success: true, data: updated });
});

export const deleteStudent = asyncHandler(async (req, res, next) => {
  const repo = getRepository("Student");
  const student = await repo.findByIdAndDelete(req.params.id);
  if (!student) return next(new AppError("Student not found", 404));

  // Remove all reports linked to this student to prevent orphan records
  const reportRepo = getRepository("Report");
  const allReports = await reportRepo.find({});
  const studentIdStr = String(req.params.id);
  const linkedReports = allReports.filter(
    (r) => String(r.studentId) === studentIdStr || String(r.student) === studentIdStr
  );
  await Promise.all(linkedReports.map((r) => reportRepo.findByIdAndDelete(r._id || r.id)));

  // Remove all notifications linked to this student
  const notifRepo = getRepository("Notification");
  const allNotifs = await notifRepo.find({});
  const linkedNotifs = allNotifs.filter(
    (n) => String(n.metadata?.studentId) === studentIdStr
  );
  await Promise.all(linkedNotifs.map((n) => notifRepo.findByIdAndDelete(n._id || n.id)));

  res.status(204).send();
});
