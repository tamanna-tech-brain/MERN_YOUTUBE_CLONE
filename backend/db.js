import mongoose from "mongoose";
import config from "./config/config.js";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    console.log("Connecting to DB:", config.MONGO_URI ? config.MONGO_URI.replace(/:[^:]*@/, ":****@") : "none");
    await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("DB Connection Error:", error.message);
  }
};

export default connectDB;