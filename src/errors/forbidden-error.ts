import { STATUS_CODES } from '../utils/statuses';
import AppError from './app-error';

export default class ForbiddenError extends AppError {
  constructor(message: string) {
    super(STATUS_CODES.FORBIDDEN, message);
  }
}
