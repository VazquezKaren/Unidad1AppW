import { Request, Response } from 'express';
import { Product } from '../models/product';

// CREATE
export const createProduct = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const newProduct = new Product();
    Object.assign(newProduct, payload);

    const product = await newProduct.save();
    return res.status(201).json({ product });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

// GET ALL
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({ status: { $ne: 'eliminado' } });
    return res.json(products);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findOneAndUpdate({ id }, updates, { new: true });
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    return res.json({ product });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// DELETE (status = "eliminado")
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndUpdate(
      { id },
      { status: 'eliminado', deleteDate: new Date() },
      { new: true }
    );

    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    return res.json({ message: 'Producto marcado como eliminado', product });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
