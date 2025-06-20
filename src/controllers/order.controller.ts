import { Request, Response } from "express";
import { Order, IOrderProduct } from "../models/order";

// Crear orden
export const crearOrder = async (req: Request, res: Response) => {
  try {
    const { userId, status, products } = req.body;

    let subtotal = 0;
    products.forEach((p: IOrderProduct) => {
      subtotal += p.qty * p.price;
    });

    const subtotalIva = subtotal * 0.16;
    const total = subtotal + subtotalIva;

    const newOrder = new Order({
      userId,
      status,
      products,
      subtotal,
      total,
      updateDate: new Date(),
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: "Error al crear orden" });
  }
};

// Actualizar a "Pagado"
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: "Pagado", updateDate: new Date() },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    return res.json({ message: "Orden actualizada a Pagado", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar orden" });
  }
};

// Cancelar
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const canceledOrder = await Order.findByIdAndUpdate(
      id,
      { status: "Cancelado", updateDate: new Date() },
      { new: true }
    );

    if (!canceledOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    return res.json({ message: "Orden cancelada", order: canceledOrder });
  } catch (error) {
    res.status(500).json({ error: "Error al cancelar orden" });
  }
};


export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('products.productId') 
      .sort({ createDate: -1 });     

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: "Error al obtener órdenes" });
  }
};