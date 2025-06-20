import { Schema, model, Types, Document } from 'mongoose';

export interface IOrderProduct {
  productId: Types.ObjectId;
  qty: number;
  price: number;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: string;
  total: number;
  subtotal: number;
  status: string;
  createDate: Date;
  updateDate: Date;
  products: IOrderProduct[];
}

const orderProductSchema = new Schema<IOrderProduct>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  qty: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const orderSchema = new Schema<IOrder>({
  userId: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  products: {
    type: [orderProductSchema],
    required: true,
    validate: [(array: any[]) => array.length > 0, 'Debe contener al menos un producto']
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  updateDate: {
    type: Date,
    default: Date.now
  }
});

export const Order = model<IOrder>('Order', orderSchema, 'order');
