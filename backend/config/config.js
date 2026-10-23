import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "mongodb+srv://dev_tamanna:tannu123@cluster0.d1xtk5s.mongodb.net/youtub_clone",
  JWT_SECRET: process.env.JWT_SECRET || "youtube_clone_jwt_secret_key_production_2026",
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  SERVER_URL: process.env.SERVER_URL || "http://localhost:3000"
};

export default config;