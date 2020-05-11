const Joi = require("@hapi/joi");

const NewPostSchema = Joi.object({
    title: Joi.string().max(50).required(),
    description: Joi.string().max(500).required(),
    type: Joi.string().regex(/^(offer)|(request)$/).required(),
    tag: Joi.string().required(),
    course: Joi.string().max(20).regex(/^[a-zA-Z0-9]+$/),
});

module.exports.NewPostSchema = NewPostSchema;
