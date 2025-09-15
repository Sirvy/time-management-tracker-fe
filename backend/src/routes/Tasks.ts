import express from 'express';
import { addUserTask, fetchTaskList, removeUserTask } from '../controllers/Tasks';
import { authenticate } from '../middlewares/Auth';

const router = express.Router();

router.get('/', authenticate, fetchTaskList);
router.post('/', authenticate, addUserTask);
router.delete('/:taskId', authenticate, removeUserTask);

export default router;