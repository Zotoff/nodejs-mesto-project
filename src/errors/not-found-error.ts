import { STATUS_CODES } from '../utils/statuses';
import AppError from './app-error';

export default class NotFoundError extends AppError {
  constructor(message: string) {
    super(STATUS_CODES.NOT_FOUND, message);
  }
}
