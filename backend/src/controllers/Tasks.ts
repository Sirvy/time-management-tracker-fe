import { NextFunction, Response } from 'express';
import Task from '../models/Tatsk';

const fetchTaskList = async (req: any, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id;

        // Fetch all categories for this user
        const tasks = await Task.find({ userId });

        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const addUserTask = async (req: any, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id;

        const { title, description, timeSpent, date, categoryId } = req.body;

        const newTask = new Task({
            title,
            description,
            timeSpent,
            date: new Date(date), // Ensure date is properly formatted
            userId,
            categoryId: categoryId !== '0' ? categoryId : null
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating new task:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const removeUserTask = async (req: any, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id;

        const taskId = req.params.taskId;
        const task = await Task.findOneAndDelete({ _id: taskId, userId: userId }); // Find and delete the task

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully', task });
    } catch (error) {
        console.error('Error creating new task:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export { fetchTaskList, addUserTask, removeUserTask };