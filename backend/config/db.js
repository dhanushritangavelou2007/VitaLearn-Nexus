import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) {
    console.log("⚠ MongoDB URI not found. Running in Demo Mode.");
    return null;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log("✅ MongoDB Connected");
    return mongoose.connection;
  } catch (error) {
    console.log("⚠ MongoDB connection failed.");
    console.log("Running in Demo Mode.");
    return null;
  }
}

export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}