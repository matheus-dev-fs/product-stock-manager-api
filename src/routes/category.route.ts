import { Router } from "express";
import * as categoriesController from "../controllers/category.controller";

const router: Router = Router();

router.post('/', categoriesController.createCategory);
router.get('/', categoriesController.listPublicCategories);
router.get('/:id', categoriesController.getCategoryById);
router.put('/:id', categoriesController.updateCategoryById);
router.delete('/:id', categoriesController.deleteCategoryById);

export default router;
