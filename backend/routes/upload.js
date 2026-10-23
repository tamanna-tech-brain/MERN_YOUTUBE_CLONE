import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { authMiddleware } from "../middleware/authMiddleware.js";

const uploadRouter = Router();

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

let uploadDir = (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
  ? "/tmp"
  : path.join(process.cwd(), "uploads");

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (error) {
  console.warn("Could not create uploads directory, falling back to /tmp:", error.message);
  uploadDir = "/tmp";
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mkv|avi|mov|webm/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype || extname) {
    return cb(null, true);
  }
  cb(new Error("Only image and video files are allowed!"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

uploadRouter.post("/", authMiddleware, (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Cloudinary Cloud Storage (if credentials provided)
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        const isVideo = req.file.mimetype.startsWith("video");
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          resource_type: isVideo ? "video" : "image",
          folder: "youtube_clone",
        });

        try {
          fs.unlinkSync(req.file.path);
        } catch {}

        return res.status(200).json({
          success: true,
          message: "File uploaded to Cloudinary successfully",
          url: uploadResult.secure_url,
        });
      } catch (cloudErr) {
        console.warn("Cloudinary upload error, using local fallback:", cloudErr.message);
      }
    }

    const filePath = `/uploads/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      url: filePath,
    });
  });
});

export default uploadRouter;
