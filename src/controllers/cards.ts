import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { ERROR_MESSAGES } from '../utils/messages';
import { STATUS_CODES } from '../utils/statuses';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find();
    return res.status(STATUS_CODES.OK).json(cards);
  } catch (error) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    return res.status(STATUS_CODES.CREATED).json(card);
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

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    if (!card) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERROR_MESSAGES.CARD_NOT_FOUND });
    }
    return res.status(STATUS_CODES.OK).json({ message: 'Карточка удалена' });
  } catch (error) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userObjectId } },
      { new: true },
    );
    if (!card) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERROR_MESSAGES.CARD_NOT_FOUND });
    }
    return res.status(STATUS_CODES.OK).json(card);
  } catch (error) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userObjectId } },
      { new: true },
    );
    if (!card) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERROR_MESSAGES.CARD_NOT_FOUND });
    }
    return res.status(STATUS_CODES.OK).json(card);
  } catch (error) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};
