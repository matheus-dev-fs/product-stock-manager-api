import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";

const router: Router = Router();

router.get('/inventory-value', dashboardController.getInventoryValue);
router.get('/stock-movements-summary', dashboardController.getStockMovementsSummary);
router.get('/stock-movements-graph', dashboardController.getOutStockMovementsGraph);
router.get('/low-stock-products', dashboardController.getLowStockProducts);
router.get('/stagnant-products', dashboardController.getStagnantProducts);

export default router;