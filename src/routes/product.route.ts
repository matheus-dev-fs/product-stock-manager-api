import { Router } from "express";
import * as productController from "../controllers/product.controller";

const router: Router = Router();

router.post("/", productController.createProduct);
router.get("/", productController.listProducts);
router.get("/:id", productController.getProductByIdWithCategory);
router.put("/:id", productController.updateProductById);

export default router;