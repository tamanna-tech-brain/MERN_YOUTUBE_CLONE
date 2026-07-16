import mongoose from "mongoose";
import config from "./config/config.js";

const connectDB = async () => {
  try {
    console.log(" Connecting to DB...");

    await mongoose.connect(config.MONGO_URI);

    console.log("Database connected");
  } catch (error) {
    console.log(" DB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;