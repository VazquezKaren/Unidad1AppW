import { Schema, model, Document } from "mongoose";

export interface IRoles extends Document {
  type: string;
}

const RolesSchema = new Schema<IRoles>({
  type: { type: String, required: true }
});

export const Roles = model<IRoles>("Roles", RolesSchema, "roles");
