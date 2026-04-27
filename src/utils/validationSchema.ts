// third-aprty libraries
import Joi from "joi";

// schema for validating profile upload
export const profileSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  gender: Joi.string()
    .valid("male", "female")
    .required(),
  gender_probability: Joi.number()
    .min(0)
    .max(1)
    .required(),
  age: Joi.number()
    .integer()
    .min(0)
    .max(120)
    .required(),
  age_group: Joi.string()
    .valid("child", "young_adult", "adult", "senior")
    .required(),
  country_id: Joi.string()
    .length(2)
    .uppercase()
    .required(),
  country_name: Joi.string().trim().required(),
  country_probability: Joi.number()
    .min(0)
    .max(1)
    .required(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

// validates payload schema
export const uploadSchema = Joi.object({
  profiles: Joi.array()
    .items(profileSchema)
    .min(1)
    .required(),
});

// profile fetching schema
export const fetchProfilesQuerySchema = Joi.object({
  gender: Joi.string()
    .valid("male", "female")
    .insensitive()
    .optional(),
  age_group: Joi.string()
    .valid("child", "teenager", "adult", "senior")
    .optional(),
  country_id: Joi.string()
    .length(2)
    .uppercase()
    .optional(),
  min_age: Joi.number()
    .integer()
    .min(0)
    .optional(),
  max_age: Joi.number()
    .integer()
    .min(0)
    .optional(),
  min_gender_probability: Joi.number()
    .min(0)
    .max(1)
    .optional(),
  min_country_probability: Joi.number()
    .min(0)
    .max(1)
    .optional(),
  sort_by: Joi.string()
    .valid("age", "created_at", "gender_probability")
    .default("created_at"),
  order: Joi.string()
    .valid("asc", "desc")
    .lowercase()
    .default("desc"),
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(10),
})
  .custom((value, helpers) => {
    if (
      value.min_age !== undefined &&
      value.max_age !== undefined &&
      value.min_age > value.max_age
    ) {
      return helpers.error("any.invalid", {
        message: "min_age cannot be greater than max_age",
      });
    }

    return value;
  })
  .messages({
    "any.invalid": "{{#message}}",
  });

  // valdiates referesh token payload
export const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required().trim()
})

// validates search strings
export const searchProfilesQuerySchema = Joi.object({
  q: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages({
      "string.empty": "Search query (q) is required",
      "string.min": "Search query must be at least 3 characters",
    }),
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(10),
});