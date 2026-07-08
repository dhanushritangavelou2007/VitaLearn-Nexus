import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) {
    console.log("No MongoDB URI found. Starting in demo mode.");
    return null;
  }

  mongoose.set("strictQuery", true);

  try {
    await Promise.race([
      mongoose.connect(uri, {
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000,
      }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("MongoDB connection timeout")), 2500);
      }),
    ]);

    console.log("MongoDB connected");
    return mongoose.connection;
  } catch (error) {
    console.warn("MongoDB unavailable, continuing in demo mode:", error.message);
    return null;
  }
}

