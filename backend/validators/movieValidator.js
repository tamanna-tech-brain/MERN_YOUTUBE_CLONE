import Joi from "joi";

export const movieSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).required(),
  director: Joi.string().allow("").optional(),
  releaseYear: Joi.number().integer().min(1888).max(new Date().getFullYear() + 5).required(),
  categoryId: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).required(),
  cast: Joi.array().items(Joi.string()).optional(),
  language: Joi.string().allow("").optional(),
  duration: Joi.number().optional(),
  poster: Joi.string().allow("").optional(),
  video: Joi.string().allow("").optional(),
  userId: Joi.string().optional()
}).unknown(true);

export const updateMovieSchema = Joi.object({
  title: Joi.string().min(2).max(100).optional(),
  description: Joi.string().min(10).optional(),
  director: Joi.string().allow("").optional(),
  releaseYear: Joi.number().integer().min(1888).max(new Date().getFullYear() + 5).optional(),
  categoryId: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).optional(),
  cast: Joi.array().items(Joi.string()).optional(),
  language: Joi.string().allow("").optional(),
  duration: Joi.number().optional(),
  poster: Joi.string().allow("").optional(),
  video: Joi.string().allow("").optional()
}).unknown(true);

export default { updateMovieSchema, movieSchema };
