import { Request, Response } from "express";
import { Order, IOrderProduct } from "../models/order";
import { User } from "../models/user";
console.log("User model loaded:", User);

import {Product} from "../models/product";

// Crear orden
export const crearOrder = async (req: Request, res: Response) => {
  try {
    const { userId, status, products } = req.body;

    // Verificar existencia del usuario
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar productos válidos
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Producto no encontrado: ${item.productId}` });
      }
    }

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
    console.error("Error al crear orden:", error);
  res.status(500).json({ error: "Error al crear orden" });
  }
};


export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || (status !== "Pagado" && status !== "Pendiente")) {
      return res.status(400).json({ message: "Estado inválido. Debe ser 'Pagado' o 'Pendiente'" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status, updateDate: new Date() },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    return res.json({ message: "Orden actualizada correctamente", order: updatedOrder });
  } catch (error) {
    console.error("Error al actualizar orden:", error);
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

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("products.productId", "name description price") // <-- importa esto
      .sort({ createDate: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ error: "Error al obtener órdenes" });
  }
};
