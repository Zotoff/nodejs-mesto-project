import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import usersRouter from './routes/usersRouter';
import cardsRouter from './routes/cardsRouter';
import { ERROR_MESSAGES } from './utils/messages';
import { STATUS_CODES } from './utils/statuses';

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

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB', err);
  });

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '69f3420ac2e5de7862137491',
  };

  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((_req: Request, res: Response) => {
  res
    .status(STATUS_CODES.NOT_FOUND)
    .json({ message: ERROR_MESSAGES.ROUTE_NOT_FOUND });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
