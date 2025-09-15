import { NextFunction, Response } from 'express';
import Category from '../models/Category';

const fetchUserCategories = async (req: any, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id;

        // Fetch all categories for this user
        const categories = await Category.find({ userId });

        return res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export { fetchUserCategories };