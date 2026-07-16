import cors from "cors";
import express from "express";
import authRouter from "./routes/auth.js";
import downloadRouter from "./routes/download.js";
import categoryRouter from "./routes/category.js";
import historyRouter from "./routes/history.js";
import movieRouter from "./routes/movie.js";
import userRouter from "./routes/user.js";
import castRouter from "./routes/cast.js";
import uploadRouter from "./routes/upload.js";
import connectDB from "./db.js";

import cookieParser from "cookie-parser";
const app = express();

// Initialize Database connection
connectDB();
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://frontend-sage-nine-41.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

let staticUploadDir = "uploads";
if (process.env.VERCEL || process.env.NODE_ENV === "production") {
  staticUploadDir = "/tmp";
}
app.use("/uploads", express.static(staticUploadDir));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/downloads", downloadRouter);
app.use("/api/movie", movieRouter);
app.use("/api/history", historyRouter);
app.use("/api/cast", castRouter);
app.use("/api/upload", uploadRouter);
export default app;