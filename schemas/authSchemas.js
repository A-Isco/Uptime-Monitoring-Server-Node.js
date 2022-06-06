const Joi = require("joi");

// Sign up validation
const signupValidationSchema = Joi.object({
  email: Joi.string().min(7).required().email(),
  password: Joi.string().required(),
});

// Verify validation
const verifyValidationSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  verificationCode: Joi.number().required(),
});

// Login validation
const loginValidationSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().required(),
});

module.exports = {
  signupValidationSchema,
  loginValidationSchema,
  verifyValidationSchema,
};
