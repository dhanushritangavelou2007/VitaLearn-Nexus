import User from "../models/User.js";
import Student from "../models/Student.js";
import Report from "../models/Report.js";
import Appointment from "../models/Appointment.js";
import Notification from "../models/Notification.js";

export async function getDashboardSummary() {
  const [users, students, reports, appointments, notifications] = await Promise.all([
    User.countDocuments(),
    Student.countDocuments(),
    Report.countDocuments(),
    Appointment.countDocuments(),
    Notification.countDocuments(),
  ]);

  return { users, students, reports, appointments, notifications };
}

