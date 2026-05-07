import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { ERROR_MESSAGES } from '../utils/messages';
import { STATUS_CODES } from '../utils/statuses';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized-error';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    return res.status(STATUS_CODES.OK).json(users);
  } catch (error) {
    return next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
    }
    return res.status(STATUS_CODES.OK).json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
    }

    return next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
    }
    return res.status(STATUS_CODES.OK).json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
    }

    return next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);

    const user = await User.create({
      name, about, avatar, email, password: hash,
    });

    return res.status(STATUS_CODES.CREATED).json({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
    }

    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      return next(new ConflictError(ERROR_MESSAGES.EMAIL_EXISTS));
    }

    return next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
    }
    return res.status(STATUS_CODES.OK).json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
    }

    return next(error);
  }
};

export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
    }
    return res.status(STATUS_CODES.OK).json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
    }

    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || 'some-secret-key',
      { expiresIn: '7d' },
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(STATUS_CODES.OK).json({ token });
  } catch (error) {
    if (
      error instanceof Error
      && (error.message === 'Неверная почта или пароль' || error.message === 'Пароли не совпадают')
    ) {
      return next(new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS));
    }

    return next(error);
  }
};
