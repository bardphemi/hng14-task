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
