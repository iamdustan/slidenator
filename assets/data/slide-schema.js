var Joi = require('joi');

module.exports = Joi.object().keys({
  content: Joi.string().required(),
  verse: Joi.string(),
  translation: Joi.string().regex(/[a-zA-Z0-9]{3,10}/),

  width: Joi.number().integer().optional(),
});

