import mongoose from "mongoose";

const reportRef = {
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
  date: String,
  type: String,
  status: String,
};

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rollNo: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    className: { type: String, required: true, trim: true },
    section: { type: String, trim: true },
    class: { type: String, trim: true },
    gender: { type: String, trim: true },
    dob: { type: String },
    bloodGroup: { type: String, trim: true },
    admissionNumber: { type: String, trim: true },
    passportNumber: { type: String, trim: true },
    passportStatus: { type: String, default: "Pending" },
    attendance: { type: String, default: "100%" },
    risk: { type: String, enum: ["healthy", "observation", "review", "critical"], default: "healthy" },
    healthScore: { type: Number, default: 100 },
    symptoms: [{ type: String }],
    allergies: [{ type: String }],
    medicalConditions: [{ type: String }],
    vaccinations: [{ type: String }],
    vitals: {
      height: String,
      weight: String,
      bmi: Number,
      vision: String,
      bloodPressure: String,
      heartRate: String,
      temperature: String,
    },
    parent: {
      name: String,
      contact: String,
      email: String,
    },
    reports: [reportRef],
    doctorNotes: String,
    timeline: [
      {
        date: String,
        title: String,
        description: String,
        type: String,
      },
    ],
    lastUpdate: { type: String, default: "Today" },
    avatar: String,
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", studentSchema);

