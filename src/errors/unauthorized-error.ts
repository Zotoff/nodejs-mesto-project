import { STATUS_CODES } from '../utils/statuses';
import AppError from './app-error';

export default class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(STATUS_CODES.UNAUTHORIZED, message);
  }
}
