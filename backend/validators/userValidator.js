import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  otp: Joi.string().length(6).required()
});

export const sendOtpSchema = Joi.object({
  email: Joi.string().email().required()
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional()
});

export const userIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required()
});

export default { registerSchema, loginSchema, updateUserSchema, userIdSchema, sendOtpSchema, verifyOtpSchema };