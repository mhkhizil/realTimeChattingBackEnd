import * as Joi from 'joi';

export const configSchemaValidation =  Joi.object({
MONGODB_URI:Joi.string().required(),
});