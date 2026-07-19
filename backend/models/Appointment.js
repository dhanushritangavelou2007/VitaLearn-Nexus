import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    scheduledAt: Date,
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

