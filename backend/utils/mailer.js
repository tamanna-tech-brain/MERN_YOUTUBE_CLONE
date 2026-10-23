import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "test@example.com",
      pass: process.env.SMTP_PASS || "testpassword",
    },
  });

  const mailOptions = {
    from: `"YouTube App Auth" <${process.env.SMTP_USER || "auth@youtubeapp.com"}>`,
    to: email,
    subject: "Your YouTube App Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f0f0f; color: #ffffff; border-radius: 10px; max-width: 500px; margin: auto; border: 1px solid #2a2a2a;">
        <h2 style="color: #ef4444; text-align: center; margin-bottom: 20px;">🎬 YouTube Clone</h2>
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 15px; line-height: 1.5;">Thank you for registering on our platform. To verify your email address, please use the following One-Time Password (OTP):</p>
        <div style="font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #ef4444; margin: 30px 0; background-color: #1c1c1c; padding: 15px; border-radius: 8px; border: 1px solid #333333;">
          ${otp}
        </div>
        <p style="font-size: 13px; color: #888888; text-align: center;">This code will expire in 5 minutes. If you did not request this code, please ignore this email.</p>
      </div>
    `,
  };

  try {
    if (process.env.SMTP_HOST && process.env.SMTP_HOST !== "smtp.ethereal.email") {
      await transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${email}`);
    } else {
      console.log(`OTP for ${email}: ${otp}`);
    }
  } catch (error) {
    console.error("Mailer Error: ", error.message);
    console.log(`OTP fallback for ${email}: ${otp}`);
  }
};
