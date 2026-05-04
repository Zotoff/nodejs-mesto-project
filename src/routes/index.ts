import { Router } from 'express';
import usersRouter from './usersRouter';
import cardsRouter from './cardsRouter';

const router = Router();

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

export default router;
