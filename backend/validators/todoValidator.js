const Joi = require('joi');

exports.createTodoSchema = Joi.object({
  text: Joi.string().min(1).max(500).required().messages({
    'string.min': 'Текст хоосон байж болохгүй',
    'string.max': 'Текст 500 тэмдэгтээс бага байх ёстой',
    'any.required': 'Текст шаардлагатай',
  }),
  category: Joi.string()
    .valid('Хувийн', 'Ажил', 'Хичээл')
    .default('Хувийн'),
  dueDate: Joi.date().iso().allow(null, '').optional(),
});

exports.updateTodoSchema = Joi.object({
  text: Joi.string().min(1).max(500).optional(),
  category: Joi.string()
    .valid('Хувийн', 'Ажил', 'Хичээл')
    .optional(),
  dueDate: Joi.date().iso().allow(null, '').optional(),
  completed: Joi.boolean().optional(),
});