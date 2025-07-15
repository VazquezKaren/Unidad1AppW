// src/controllers/report.controller.ts
import { Request, Response } from "express";
import Report from "../models/report";

// Crear nuevo reporte
export const crearReporte = async (req: Request, res: Response) => {
  try {
    const { title, description, status } = req.body;
    const nuevoReporte = new Report({ title, description, status });
    await nuevoReporte.save();
    res.status(201).json(nuevoReporte);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el reporte", error });
  }
};

// Obtener todos los reportes (que no estén eliminados)
export const getReports = async (_req: Request, res: Response) => {
  try {
    const reportes = await Report.find({ deleteDate: null }).sort({ createDate: -1 });
    res.status(200).json(reportes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reportes", error });
  }
};

// Actualizar reporte por ID
export const actualizarReporte = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const actualizado = await Report.findByIdAndUpdate(
      id,
      {
        title,
        description,
        status,
        updateDate: new Date(),
      },
      { new: true }
    );
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el reporte", error });
  }
};

// Borrar (soft delete) reporte
export const eliminarReporte = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eliminado = await Report.findByIdAndUpdate(
      id,
      { deleteDate: new Date() },
      { new: true }
    );
    res.status(200).json({ message: "Reporte eliminado", eliminado });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el reporte", error });
  }
};
