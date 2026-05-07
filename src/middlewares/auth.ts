import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../utils/messages';
import UnauthorizedError from '../errors/unauthorized-error';

export default (req: Request, res: Response, next: NextFunction) => {
  const tokenFromCookie = req.cookies?.jwt;
  const { authorization } = req.headers;
  const tokenFromHeader = authorization?.startsWith('Bearer ')
    ? authorization.replace('Bearer ', '')
    : '';
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return next(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));
  }

  let payload: jwt.JwtPayload | string;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || 'some-secret-key');
  } catch (error) {
    return next(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));
  }

  if (typeof payload === 'string' || !('_id' in payload)) {
    return next(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));
  }

  req.user = { _id: String(payload._id) };

  return next();
};
