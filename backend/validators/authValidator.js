const Joi = require('joi');

exports.registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum':
        'Хэрэглэгчийн нэр зөвхөн үсэг, тоо агуулсан байх ёстой',
      'string.min': 'Хэрэглэгчийн нэр дор хаяж 3 тэмдэгт',
      'string.max': 'Хэрэглэгчийн нэр 30 тэмдэгтээс бага',
      'any.required': 'Хэрэглэгчийн нэр шаардлагатай',
    }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.min': 'Нууц үг дор хаяж 6 тэмдэгт',
    'string.max': 'Нууц үг 128 тэмдэгтээс бага',
    'any.required': 'Нууц үг шаардлагатай',
  }),
});

exports.loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Хэрэглэгчийн нэр шаардлагатай',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Нууц үг шаардлагатай',
  }),
});