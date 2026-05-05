import { Router } from "express";
import * as productController from "../controllers/product.controller.js";

const router: Router = Router();

router.post("/", productController.createProduct);
router.get("/", productController.listProducts);
router.get("/:id", productController.getProductWithDetailsById);
router.put("/:id", productController.updateProductById);
router.delete("/:id", productController.deleteProductById);

export default router;