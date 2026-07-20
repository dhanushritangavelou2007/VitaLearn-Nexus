import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    // Legacy / symptom-report fields (used by POST /symptoms via symptomsController).
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, default: "Observation" },
    extraNotes: String,
    attachments: [String],
    risk: { type: String, enum: ["healthy", "observation", "review", "critical"], default: "healthy" },

    // Teacher/Student/Parent → Doctor observation pipeline fields.
    // senderId is stored as a String (not an ObjectId ref) because demo-mode
    // user ids look like "demo-user-0", not valid ObjectIds — this keeps the
    // schema usable in both demo and real-DB mode without a migration.
    senderId: { type: String },
    senderRole: { type: String, enum: ["teacher", "doctor", "parent", "student", "admin"] },
    senderName: { type: String },
    symptoms: [{ type: String }],
    severity: { type: Number, default: 1 },
    temperature: { type: String },
    notes: String,
    date: { type: String, default: () => new Date().toISOString().split("T")[0] },

    // pending | reviewed  (legacy symptom flow also uses "Pending Review" —
    // both are treated as "not yet reviewed" by the UI's StatusBadge)
    status: { type: String, default: "pending" },
    observation: { type: String, default: null },
    observationSentAt: { type: Date, default: null },
    reviewedBy: { type: String, default: null },

    // Full doctor review fields — sent to parent AND student dashboards
    diagnosis: { type: String, default: null },
    doctorReview: { type: String, default: null },
    recommendation: { type: String, default: null },
    prescription: { type: String, default: null },
    reviewedByName: { type: String, default: null },
    reviewedByRole: { type: String, default: "doctor" },

    // The student this report is about (string ID — demo-safe)
    studentId: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Report || mongoose.model("Report", reportSchema);
