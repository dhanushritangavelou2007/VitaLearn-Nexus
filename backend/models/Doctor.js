import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    registrationNo: String,
    specialization: String,
  },
  { timestamps: true }
);

export default mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

