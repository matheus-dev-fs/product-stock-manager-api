import { Router, Request, Response } from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: Router = Router();

router.get('/ping', (req: Request, res: Response): void => {
    res.json({ pong: true });
});

router.use('/auth', authRoutes);

router.use(authMiddleware);

router.use('/users', userRoutes);

export default router;