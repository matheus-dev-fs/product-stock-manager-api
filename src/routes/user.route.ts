import { Router} from "express";
import * as userController from "../controllers/user.controller.js";
import { uploadAvatar } from "../middlewares/upload.middleware.js";

const router: Router = Router();

router.post('/', userController.createUser);
router.get('/', userController.listPublicUsers);
router.get('/:id', userController.getPublicUserById);
router.delete('/:id', userController.deleteUserById);
router.put('/:id', uploadAvatar, userController.updateUserById);

export default router;