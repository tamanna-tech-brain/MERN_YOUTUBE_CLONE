import Joi from "joi";
export const movieSchema = Joi.object({
  userId: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  categoryId: Joi.array().items(Joi.string()).required(),
  language: Joi.string().required(),
  duration: Joi.number().required(),
  cast: Joi.array().items(Joi.string()).required(),
  releaseYear: Joi.number().required(),
  poster: Joi.string().allow("").optional()
});

export const updateMovieSchema = Joi.object({
  userId: Joi.string().optional(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  categoryId: Joi.array().items(Joi.string()).optional(),
  language: Joi.string().optional(),
  duration: Joi.number().optional(),
  cast: Joi.array().items(Joi.string()).optional(),
  releaseYear: Joi.number().optional(),
  poster: Joi.string().allow("").optional()
});


export default { updateMovieSchema, movieSchema };
