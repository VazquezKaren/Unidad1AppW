import { Document, model, Schema, Types } from 'mongoose';

export interface IRole extends Document{
  _id: Types.ObjectId;
  type: string;
}

const roleSchema = new Schema<IRole>({
  type: { 
    type: String, 
    required: true, 
    unique: true }
});

export const Role = model<IRole>('Role', roleSchema, 'role');