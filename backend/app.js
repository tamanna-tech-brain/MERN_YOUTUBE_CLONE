import path from "path";
import fs from "fs";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRouter from "./routes/auth.js";
import downloadRouter from "./routes/download.js";
import categoryRouter from "./routes/category.js";
import historyRouter from "./routes/history.js";
import movieRouter from "./routes/movie.js";
import userRouter from "./routes/user.js";
import castRouter from "./routes/cast.js";
import uploadRouter from "./routes/upload.js";
import commentRouter from "./routes/comment.js";
import subscriptionRouter from "./routes/subscription.js";
import connectDB from "./db.js";
import config from "./config/config.js";

const app = express();

connectDB();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes."
  }
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://frontend-sage-nine-41.vercel.app",
  config.CLIENT_URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

let staticUploadDir = (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
  ? "/tmp"
  : path.join(process.cwd(), "uploads");

try {
  if (!fs.existsSync(staticUploadDir)) {
    fs.mkdirSync(staticUploadDir, { recursive: true });
  }
} catch {
  staticUploadDir = "/tmp";
}
app.use("/uploads", express.static(staticUploadDir));

app.use("/api/auth", authLimiter, authRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/downloads", downloadRouter);
app.use("/api/movie", movieRouter);
app.use("/api/history", historyRouter);
app.use("/api/cast", castRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/comment", commentRouter);
app.use("/api/subscription", subscriptionRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

const clientBuildPath = path.resolve(process.cwd(), "../frontend/dist");
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// Central Error Handling Middleware
app.use((err, req, res, _next) => {
  console.error("Global Error Handler:", err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

export default app;