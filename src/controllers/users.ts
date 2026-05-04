import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import { ERROR_MESSAGES } from '../utils/messages';
import { STATUS_CODES } from '../utils/statuses';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(STATUS_CODES.OK).json(users);
  } catch (error) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }
    return res.status(STATUS_CODES.OK).json(user);
  } catch (error) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(STATUS_CODES.CREATED).json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.INVALID_DATA });
    }

    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }
    return res.status(STATUS_CODES.OK).json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.INVALID_DATA });
    }

    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }
    return res.status(STATUS_CODES.OK).json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.INVALID_DATA });
    }

    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};
