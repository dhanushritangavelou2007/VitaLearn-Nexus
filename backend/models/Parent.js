import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    relation: String,
  },
  { timestamps: true }
);

export default mongoose.models.Parent || mongoose.model("Parent", parentSchema);

