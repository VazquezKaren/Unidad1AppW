import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    id: string;
    description: string;
    qty: number;
    status: string;
    price: number;
    createDate: Date;
    deleteDate: Date | null;
}

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: 'disponible',
    },
    price: {
        type: Number,
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    deleteDate: {
        type: Date,
        default: null,
    },
});

export const Product = model<IProduct>('Product', productSchema, 'product');
