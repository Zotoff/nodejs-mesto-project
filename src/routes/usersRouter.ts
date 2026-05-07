import { Router } from 'express';

import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUserAvatar,
  updateUser,
} from '../controllers/users';
import {
  validateAuthHeader,
  validateUpdateAvatar,
  validateUpdateProfile,
  validateUserId,
} from '../middlewares/validation';

const router = Router();

router.get('/', validateAuthHeader, getUsers);

router.get('/me', validateAuthHeader, getCurrentUser);

router.get('/:userId', validateAuthHeader, validateUserId, getUserById);

router.patch('/me', validateAuthHeader, validateUpdateProfile, updateUser);

router.patch('/me/avatar', validateAuthHeader, validateUpdateAvatar, updateUserAvatar);

export default router;
