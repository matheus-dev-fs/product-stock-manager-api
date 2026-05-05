import { Router, Request, Response } from 'express';
import userRoutes from './user.route.js';
import authRoutes from './auth.route.js';
import categoriesRoutes from './category.route.js';
import productsRoutes from './product.route.js';
import stockMovementRoutes from './stock-movement.route.js';
import dashboardRoutes from './dashboard.route.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

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
router.use('/dashboard', dashboardRoutes);

export default router;