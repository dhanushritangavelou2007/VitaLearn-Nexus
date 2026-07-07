import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) {
    return null;
  }

  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri);
    return mongoose.connection;
  } catch (error) {
    console.warn("MongoDB connection failed, continuing without DB:", error.message);
    return null;
  }
}
