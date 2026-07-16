import usermodel from "../models/user.js";
import otpModel from "../models/otp.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 
import { sendOtpEmail } from "../utils/mailer.js";

// Send OTP to user email
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
    
    // Check if user already exists
    const existingUser = await usermodel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered"
      });
    }

    // Generate a 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Save or update OTP in DB
    await otpModel.findOneAndUpdate(
      { email: normalizedEmail },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // Send the OTP email
    await sendOtpEmail(normalizedEmail, otp);

    return res.status(200).json({
      success: true,
      message: "Verification OTP code sent to your email successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Verify OTP directly (optional helper endpoint)
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

// Register user after verifying OTP
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

    // Verify OTP code
    const otpRecord = await otpModel.findOne({ email: normalizedEmail });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new verified user
    const user = await usermodel.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: true
    });

    // Clean up OTP record
    await otpModel.deleteOne({ email: normalizedEmail });

    // Generate JWT access token
    let accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // Set to true if HTTPS
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

// User login
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

    let accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
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
