import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    notes: String,
    attachments: [String],
    risk: { type: String, enum: ["healthy", "observation", "review", "critical"], default: "healthy" },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Report || mongoose.model("Report", reportSchema);

