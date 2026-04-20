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

