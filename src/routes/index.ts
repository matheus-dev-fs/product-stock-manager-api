import { Router, Request, Response } from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';

const router: Router = Router();

router.get('/ping', (req: Request, res: Response): void => {
    res.json({ pong: true });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;