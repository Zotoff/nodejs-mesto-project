import { Router } from 'express';

import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import {
  validateAuthHeader,
  validateCardId,
  validateCreateCard,
} from '../middlewares/validation';

const router = Router();

router.get('/', validateAuthHeader, getCards);

router.post('/', validateAuthHeader, validateCreateCard, createCard);

router.delete('/:cardId', validateAuthHeader, validateCardId, deleteCard);

router.put('/:cardId/likes', validateAuthHeader, validateCardId, likeCard);

router.delete('/:cardId/likes', validateAuthHeader, validateCardId, dislikeCard);

export default router;
