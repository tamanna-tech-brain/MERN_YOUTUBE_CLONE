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

import cookieParser from "cookie-parser";
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/downloads", downloadRouter);
app.use("/api/movie", movieRouter);
app.use("/api/history", historyRouter);
app.use("/api/cast", castRouter);
app.use("/api/upload", uploadRouter);
export default app;