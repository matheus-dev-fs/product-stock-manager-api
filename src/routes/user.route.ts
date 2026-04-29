import { Router} from "express";
import * as userController from "../controllers/user.controller";

const router: Router = Router();

router.post('/', userController.createUser);
router.get('/', userController.listPublicUsers);

export default router;