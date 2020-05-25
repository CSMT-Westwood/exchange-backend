const Joi = require("@hapi/joi");

const NewPostSchema = Joi.object({
    typeOfPost: Joi.number().integer().min(0).max(1).required(),
    typeOfItem: Joi.number().integer().min(0).max(2).required(),
    course: Joi.string().max(20).regex(/^[a-zA-Z0-9 ]+$/),
    itemName: Joi.string().max(50).required(),
    condition: Joi.number().integer().min(0).max(3),
    description: Joi.string().max(140).required(),
    link: Joi.string(),
    fulfilled: Joi.number().integer().min(0).max(3),
});

module.exports.NewPostSchema = NewPostSchema;
