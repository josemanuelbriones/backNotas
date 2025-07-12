import { Router } from 'express';
import {
    getAllTasks,
    createTask,
    getTaskById,
    updateTask,
    updateTaskStatus,
    deleteTask
} from '../controllers/taskController.js';
const router = Router();

router.get('/', getAllTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask); 
router.patch('/:id', updateTaskStatus); 
router.delete('/:id', deleteTask);

export default router;