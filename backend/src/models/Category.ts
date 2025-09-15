import mongoose, { Document, Schema } from 'mongoose';

interface ICategory extends Document {
    name: string;
    color: string;
    userId: mongoose.Schema.Types.ObjectId;
}

const categorySchema: Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User' // Reference to User model
        }
    },
    { timestamps: false }
);

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
