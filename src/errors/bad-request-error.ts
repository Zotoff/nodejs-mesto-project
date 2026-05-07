import { STATUS_CODES } from '../utils/statuses';
import AppError from './app-error';

export default class BadRequestError extends AppError {
  constructor(message: string) {
    super(STATUS_CODES.BAD_REQUEST, message);
  }
}
