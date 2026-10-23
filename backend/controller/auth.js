import usermodel from "../models/user.js";
import otpModel from "../models/otp.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "../utils/mailer.js";

export async function sendOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const normalizedEmail = email.toLowerCase();
    
    const existingUser = await usermodel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await otpModel.findOneAndUpdate(
      { email: normalizedEmail },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await sendOtpEmail(normalizedEmail, otp);

    const devOtp = (!process.env.SMTP_HOST || process.env.SMTP_HOST === "smtp.ethereal.email" || process.env.NODE_ENV !== "production") ? otp : undefined;

    return res.status(200).json({
      success: true,
      message: "Verification OTP code sent to your email successfully",
      otp: devOtp
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    const normalizedEmail = email.toLowerCase();
    const otpRecord = await otpModel.findOne({ email: normalizedEmail });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function register(req, res) {
  try {
    const { username, email, password, otp } = req.body;
    if (!username || !email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields including OTP are required"
      });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await usermodel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const otpRecord = await otpModel.findOne({ email: normalizedEmail });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await usermodel.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: true
    });

    await otpModel.deleteOne({ email: normalizedEmail });

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "youtube_clone_jwt_secret_key_production_2026",
      { expiresIn: "1d" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      data: user,
      token: accessToken,
      message: "User registered successfully"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const user = await usermodel.findOne({ email: normalizedEmail });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "youtube_clone_jwt_secret_key_production_2026",
      { expiresIn: "1d" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    return res.status(200).json({
      success: true,
      data: user,
      token: accessToken,
      message: "User logged In successfully"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
