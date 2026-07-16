import Joi from "joi";
export const castSchema = Joi.object({
  name: Joi.string().min(2).required(),
  age: Joi.number().optional(),
  bio: Joi.string().allow(""),
  image: Joi.string().allow("")
});
export const updateCastSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  age: Joi.number().optional(),
  bio: Joi.string().allow("").optional(),
  image: Joi.string().allow("").optional()
});



export default {castSchema,updateCastSchema};