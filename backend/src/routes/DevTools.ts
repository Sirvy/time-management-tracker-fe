import express from 'express';
import Category from '../models/Category';
import User from '../models/User';
import Task from '../models/Tatsk';

const router = express.Router();

router.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.get('/categories', async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});


router.get('/categories/:id', async (req, res) => {
    try {
        const categoryId = req.params.id; // Get the category ID from the URL parameters
        const category = await Category.findById(categoryId); // Find the category by ID

        if (!category) {
            return res.status(404).json({ message: 'Category not found' }); // Handle not found case
        }

        res.json(category); // Return the found category
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Server error' }); // Handle server error
    }
});

router.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

export default router;