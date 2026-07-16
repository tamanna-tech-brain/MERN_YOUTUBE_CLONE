import Joi from "joi";
export const movieSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).required(),
  director: Joi.string().required(),
  releaseYear: Joi.number().integer().min(1888).max(new Date().getFullYear()).required(),
  categoryId: Joi.string().required(),
  cast: Joi.array().items(Joi.string()).optional(),
  poster: Joi.string().allow("").optional(),
  video: Joi.string().allow("").optional()
});

export const updateMovieSchema = Joi.object({
  title: Joi.string().min(2).max(100).optional(),
  description: Joi.string().min(10).optional(),
  director: Joi.string().optional(),
  releaseYear: Joi.number().integer().min(1888).max(new Date().getFullYear()).optional(),
  categoryId: Joi.string().optional(),
  cast: Joi.array().items(Joi.string()).optional(),
  poster: Joi.string().allow("").optional(),
  video: Joi.string().allow("").optional()
});


export default { updateMovieSchema, movieSchema };
