var Joi = require('joi');

module.exports = Joi.object().keys({
  content: Joi.string().required(),
  translation: Joi.string().regex(/[a-zA-Z0-9]{3,10}/),
  verse: Joi.string(),

  width: Joi.number().integer().optional(),
});

