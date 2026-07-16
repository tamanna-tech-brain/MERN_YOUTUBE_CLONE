import { Router } from "express";
import { validate } from "../middleware/validate.js";
import *as authcontroller from "../controller/auth.js"
import { registerSchema, loginSchema, sendOtpSchema, verifyOtpSchema } from "../validators/userValidator.js";
const authRouter = Router();

authRouter.post("/register", validate(registerSchema), authcontroller.register)
authRouter.post("/login", validate(loginSchema), authcontroller.login)
authRouter.post("/send-otp", validate(sendOtpSchema), authcontroller.sendOtp)
authRouter.post("/verify-otp", validate(verifyOtpSchema), authcontroller.verifyOtp)
export default authRouter;