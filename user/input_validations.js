const Joi = require("@hapi/joi");

const signUpSchema = Joi.object({
    username: Joi.string().min(5).max(30).required(),
    password: Joi.string().min(8).max(100).required(),
    email: Joi.string().email().required(),
    preferences: Joi.array().items(
        Joi.string()
            .max(20)
            .regex(/^[a-zA-Z0-9]+$/)
    ),
    info: Joi.object().keys({
        num_of_followers: Joi.number().integer().greater(-1),
        last_login: Joi.date(),
        date_of_creation: Joi.date(),
    }),
});

const loginSchema = Joi.object({
    username: Joi.string().min(5).required(),
    password: Joi.string().min(8).max(100).required(),
});
module.exports.signUpSchema = signUpSchema;
module.exports.loginSchema = loginSchema;
