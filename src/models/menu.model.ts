import { Schema, model, Types, Document } from "mongoose";

export interface IMenu extends Document {
  title: string;
  path: string;
  icon: string;
  roles: string[]; 
}

const MenuSchema = new Schema<IMenu>({
  title: { type: String, required: true },
  path: { type: String, required: true },
  icon: { type: String, required: true },
  roles: {type: [String], required: true, enum: ['admin', 'usuario'] }
});

export const Menu = model<IMenu>("Menu", MenuSchema, "menus");
