import { Router, Request, Response } from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import categoriesRoutes from './category.route';
import productsRoutes from './product.route';
import stockMovementRoutes from './stock-movement.route';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: Router = Router();

router.get('/ping', (req: Request, res: Response): void => {
    res.json({ pong: true });
});

router.use('/auth', authRoutes);

router.use(authMiddleware);

router.use('/users', userRoutes);
router.use('/categories', categoriesRoutes);
router.use('/products', productsRoutes);
router.use('/stock-movements', stockMovementRoutes);

export default router;