import express, { Response } from 'express';
import { authenticate } from '../middlewares/Auth';
import { fetchUserCategories } from '../controllers/Categories';

const router = express.Router();

router.get('/profile', authenticate, (req: any, res: Response) => {
    res.json({ message: `${req.user.username}` });
});

router.get('/categories', authenticate, fetchUserCategories);

export default router;