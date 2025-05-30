import { Document, model, Schema, Types } from 'mongoose';

export interface IOrder extends Document {
  _id: Types.ObjectId;
  createDate: Date;
  user: Types.ObjectId;
  subtotal: number;
  total: number;
}

const orderSchema = new Schema<IOrder>({
  createDate: { 
    type: Date, 
    default: Date.now 
    },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', required: true 
    },
  subtotal: { 
    type: Number, 
    required: true 
    },
  total: { 
    type: Number, 
    required: true 
},
});

export const Order = model<IOrder>('Order', orderSchema, 'order');