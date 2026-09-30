import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.js';
import { createTaskSchema, updateTaskSchema } from '../validations/task.validation.js';
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
} from '../controllers/task.controller.js';

const router = express.Router();


router.use(auth);

router.post('/', validate(createTaskSchema), createTask);
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
