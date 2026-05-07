import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import router from './routes';
import auth from './middlewares/auth';
import { createUser, login } from './controllers/users';
import { ERROR_MESSAGES } from './utils/messages';
import { STATUS_CODES } from './utils/statuses';
import { requestLogger, errorLogger } from './middlewares/logger';
import { validateSignIn, validateSignUp } from './middlewares/validation';

/* eslint-disable no-shadow, no-unused-vars -- augmentation merges Express Request */
declare module 'express-serve-static-core' {
  interface Request {
    user: {
      _id: string;
    };
  }
}
/* eslint-enable no-shadow, no-unused-vars */

dotenv.config();

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignUp, createUser);
app.use(auth);
app.use(router);

app.use(errorLogger);
app.use(errors());

app.use((_req: Request, res: Response) => {
  res
    .status(STATUS_CODES.NOT_FOUND)
    .json({ message: ERROR_MESSAGES.ROUTE_NOT_FOUND });
});

app.use((
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  const { statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === STATUS_CODES.INTERNAL_SERVER_ERROR
        ? ERROR_MESSAGES.SERVER_ERROR
        : message,
    });

  return undefined;
});

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  });
