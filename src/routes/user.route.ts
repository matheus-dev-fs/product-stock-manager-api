import { Router} from "express";
import * as userController from "../controllers/user.controller";

const router: Router = Router();

router.post('/', userController.createUser);

export default router;