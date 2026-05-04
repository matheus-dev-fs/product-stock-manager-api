import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";

const router: Router = Router();

router.get('/inventory-value', dashboardController.getInventoryValue);
router.get('/stock-movements-summary', dashboardController.getStockMovementsSummary);

export default router;