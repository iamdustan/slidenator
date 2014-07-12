var Joi = require('joi');

module.exports = Joi.object().keys({
  Content: Joi.string().required(),
  Translation: Joi.string().regex(/[a-zA-Z0-9]{3,10}/),
  Verse: Joi.string(),
});

