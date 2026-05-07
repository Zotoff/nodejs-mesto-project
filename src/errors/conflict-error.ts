import { STATUS_CODES } from '../utils/statuses';
import AppError from './app-error';

export default class ConflictError extends AppError {
  constructor(message: string) {
    super(STATUS_CODES.CONFLICT, message);
  }
}
