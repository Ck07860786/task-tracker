import Task from '../models/Task.js';

//create task
export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        const task = await Task.create({
            title,
            description,
            user: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: 'Task created successfully.',
            data: { task },
        });
    } catch (error) {
        console.error('Create Task Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};

//get all tasks
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            message: `Found ${tasks.length} task(s).`,
            data: { tasks },
        });
    } catch (error) {
        console.error('Get Tasks Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};

//get task by id
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.',
            });
        }

        res.status(200).json({
            success: true,
            data: { task },
        });
    } catch (error) {
        console.error('Get Task Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};

//update task

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task updated successfully.',
            data: { task },
        });
    } catch (error) {
        console.error('Update Task Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};

// delete task
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully.',
        });
    } catch (error) {
        console.error('Delete Task Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};
