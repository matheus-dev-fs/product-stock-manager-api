import { Router} from "express";
import * as userController from "../controllers/user.controller";

const router: Router = Router();

router.post('/', userController.createUser);
router.get('/', userController.listPublicUsers);
router.get('/:id', userController.getPublicUserById);
router.delete('/:id', userController.deleteUserById);

export default router;