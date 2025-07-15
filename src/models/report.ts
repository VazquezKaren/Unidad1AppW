// src/models/report.ts
import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["pendiente", "completado", "cancelado"], default: "pendiente" },
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date },
  deleteDate: { type: Date, default: null },
});

export default mongoose.model("Report", ReportSchema, "report");
