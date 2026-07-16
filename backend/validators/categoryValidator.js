import Joi from "joi";

export const categorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string().min(5).max(200).required(),
  image: Joi.string().allow("").optional()
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  description: Joi.string().min(5).max(200).optional(),
  image: Joi.string().allow("").optional()
});

export default{ updateCategorySchema, categorySchema};