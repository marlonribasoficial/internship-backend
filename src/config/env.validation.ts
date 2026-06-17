import * as Joi from 'joi';

const FIRESTORE_REQUIRED_PARAMS = [
  'loadBalanced=true',
  'tls=true',
  'authMechanism=SCRAM-SHA-256',
  'retryWrites=false',
] as const;

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  MONGODB_URI: Joi.string()
    .pattern(/^mongodb(\+srv)?:\/\//)
    .required()
    .custom((value: string, helpers) => {
      if (!value.includes('firestore.goog')) {
        return value;
      }

      for (const param of FIRESTORE_REQUIRED_PARAMS) {
        if (!value.includes(param)) {
          return helpers.error('any.custom', {
            message: `MONGODB_URI (Firestore) must include ${param}`,
          });
        }
      }

      return value;
    }),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  APPLE_CLIENT_ID: Joi.string().required(),
});
