import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { ERROR_MESSAGES } from '../utils/messages';
import { STATUS_CODES } from '../utils/statuses';
import BadRequestError from '../errors/bad-request-error';
import ForbiddenError from '../errors/forbidden-error';
import NotFoundError from '../errors/not-found-error';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find();
    return res.status(STATUS_CODES.OK).json(cards);
  } catch (error) {
    return next(error);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    return res.status(STATUS_CODES.CREATED).json(card);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
    }

    return next(error);
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      return next(new NotFoundError(ERROR_MESSAGES.CARD_NOT_FOUND));
    }

    if (String(card.owner) !== req.user._id) {
      return next(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));
    }

    await card.deleteOne();

    return res.status(STATUS_CODES.OK).json({ message: 'Карточка удалена' });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
    }

    return next(error);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userObjectId } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError(ERROR_MESSAGES.CARD_NOT_FOUND));
    }
    return res.status(STATUS_CODES.OK).json(card);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
    }

    return next(error);
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userObjectId } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError(ERROR_MESSAGES.CARD_NOT_FOUND));
    }
    return res.status(STATUS_CODES.OK).json(card);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
    }

    return next(error);
  }
};
