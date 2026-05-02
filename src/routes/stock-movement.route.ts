import { Router } from "express";
import * as stockMovementController from '../controllers/stock-movement.controller';

const router = Router();

router.post('/', stockMovementController.createStockMovement);
router.get('/', stockMovementController.listStockMovementsWithDetails);

export default router;