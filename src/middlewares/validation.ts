import { celebrate, Joi, Segments } from 'celebrate';
import { URL_REGEX } from '../utils/regex';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const bearerTokenPattern = /^Bearer\s.+$/;

export const validateAuthHeader = celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().pattern(bearerTokenPattern),
  }).unknown(true),
});

export const validateSignUp = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(URL_REGEX),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const validateSignIn = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().required().pattern(objectIdPattern),
  }),
});

export const validateUpdateProfile = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});

export const validateUpdateAvatar = celebrate({
  [Segments.BODY]: Joi.object({
    avatar: Joi.string().required().pattern(URL_REGEX),
  }),
});

export const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(URL_REGEX),
  }),
});

export const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object({
    cardId: Joi.string().required().pattern(objectIdPattern),
  }),
});
