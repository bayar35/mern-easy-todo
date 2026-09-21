const Joi = require('joi');

exports.createProductSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  price: Joi.number().min(0).required(),
  image: Joi.string().uri().optional(),
  description: Joi.string().max(1000).optional(),
});