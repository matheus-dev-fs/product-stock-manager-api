import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/ping', (req: Request, res: Response): void => {
    res.json({ pong: true });
});

export default router;