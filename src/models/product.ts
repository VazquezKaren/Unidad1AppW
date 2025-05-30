import { Document, model, Schema, Types } from 'mongoose';

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

const productSchema = new Schema<IProduct>({

    name: {
        type: String, 
        required: true,
    },
    description: { 
        type: String
    },
  quantity: { 
        type: Number, 
        required: true 
    },
  price: { 
    type: Number, 
    required: true 
    },
});

export const Product = model<IProduct>('Product', productSchema, 'product');