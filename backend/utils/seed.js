import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { DEMO_USERS } from "./constants.js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Doctor from "../models/Doctor.js";
import Parent from "../models/Parent.js";
import Admin from "../models/Admin.js";
import Report from "../models/Report.js";
import Notification from "../models/Notification.js";
import Appointment from "../models/Appointment.js";

dotenv.config();

const seedStudents = [
  {
    rollNo: "8A01",
    name: "Aarav Sharma",
    class: "VIII-A",
    className: "VIII",
    section: "A",
    gender: "Male",
    dob: "2010-04-15",
    bloodGroup: "O+",
    parent: { name: "Rajesh Sharma", contact: "+91-9876543210", email: "rajesh.s@example.com" },
    allergies: ["Dust"],
    medicalConditions: ["Mild Asthma"],
    vitals: { height: "155 cm", weight: "45 kg", bmi: 18.7, vision: "6/6", bloodPressure: "110/70", heartRate: "78", temperature: "98.4" },
    vaccinations: ["BCG", "OPV", "COVID-19", "MMR"],
    symptoms: ["Occasional cough"],
    reports: [],
    risk: "observation",
    attendance: "96%",
    lastUpdate: "Today",
    passportStatus: "Completed",
  },
];

async function seed() {
  await connectDB(process.env.MONGODB_URI);

  await Promise.all([User.deleteMany({}), Student.deleteMany({}), Teacher.deleteMany({}), Doctor.deleteMany({}), Parent.deleteMany({}), Admin.deleteMany({}), Report.deleteMany({}), Notification.deleteMany({}), Appointment.deleteMany({})]);

  const users = [];
  for (const demo of DEMO_USERS) {
    const password = await bcrypt.hash(demo.password, 12);
    const user = await User.create({ name: demo.name, email: demo.email, password, role: demo.role, isActive: true });
    users.push(user);
  }

  const [teacherUser, doctorUser, parentUser, studentUser, adminUser] = users;

  await Teacher.create({ user: teacherUser._id, employeeId: "TCH-001", department: "Health & Wellness", classAssigned: "VIII-A" });
  await Doctor.create({ user: doctorUser._id, registrationNo: "DOC-1001", specialization: "Pediatrics" });
  await Parent.create({ user: parentUser._id, relation: "Father" });
  await Student.create({ ...seedStudents[0], user: studentUser._id });
  await Admin.create({ user: adminUser._id, permissions: ["all"] });

  const student = await Student.findOne({ rollNo: "8A01" });
  const teacher = await User.findOne({ email: "teacher@vitalearn.ai" });

  await Report.create({
    student: student._id,
    createdBy: teacher._id,
    type: "General Checkup",
    status: "Normal",
    date: "2024-01-15",
    risk: "observation",
  });

  await Notification.create({
    recipient: parentUser._id,
    title: "Health Update",
    message: "A new symptom observation has been recorded.",
    type: "info",
  });

  console.log("Seed completed successfully.");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

