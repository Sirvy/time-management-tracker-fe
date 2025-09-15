import mongoose, { Document, Schema } from 'mongoose';

interface ITask extends Document {
    title: string;
    description: string;
    timeSpent: number;
    date: Date,
    userId: mongoose.Schema.Types.ObjectId;
    categoryId?: mongoose.Schema.Types.ObjectId;
}

const taskSchema: Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true // Title is required
    },
    description: {
        type: String,
        required: false // Description is optional
    },
    timeSpent: {
        type: Number,
        required: true // Time spent in seconds
    },
    date: {
        type: Date,
        required: true // Date is required
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user
        required: true,
        ref: 'User' // Reference to User model
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId, // Can be a number or null
        ref: 'Category',
        required: false, // Category ID is optional
        default: null // Default value can be null or you can specify a default category ID
    }
});

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
