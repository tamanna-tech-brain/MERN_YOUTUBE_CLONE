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
    from: `"Movie App Auth" <${process.env.SMTP_USER || "auth@movieapp.com"}>`,
    to: email,
    subject: "Your Movie App Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f0f0f; color: #ffffff; border-radius: 10px; max-width: 500px; margin: auto; border: 1px solid #2a2a2a;">
        <h2 style="color: #ef4444; text-align: center; margin-bottom: 20px;">🎬 Movie App</h2>
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 15px; line-height: 1.5;">Thank you for registering on our Movie platform. To verify your email address, please use the following One-Time Password (OTP):</p>
        <div style="font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #ef4444; margin: 30px 0; background-color: #1c1c1c; padding: 15px; border-radius: 8px; border: 1px solid #333333;">
          ${otp}
        </div>
        <p style="font-size: 13px; color: #888888; text-align: center;">This code will expire in 5 minutes. If you did not request this code, please ignore this email.</p>
      </div>
    `,
  };

  try {
    // Only send actual mail if SMTP_HOST is explicitly configured
    if (process.env.SMTP_HOST && process.env.SMTP_HOST !== "smtp.ethereal.email") {
      await transporter.sendMail(mailOptions);
      console.log(`✉️ OTP email sent to ${email}`);
    } else {
      console.log("\n----------------------------------------------");
      console.log(`🔑 [SMTP NOT CONFIGURED] OTP for ${email}: ${otp}`);
      console.log("----------------------------------------------\n");
    }
  } catch (error) {
    console.error("❌ Mailer Error: ", error.message);
    console.log("\n----------------------------------------------");
    console.log(`🔑 [MAILER FALLBACK] OTP for ${email}: ${otp}`);
    console.log("----------------------------------------------\n");
  }
};
