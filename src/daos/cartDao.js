// src/daos/cartDAO.js
import { CartModel } from "../models/cartModel.js";

export class CartDAO {
  // Crear un carrito nuevo
  async create(cartData) {
    const cart = new CartModel(cartData);
    return await cart.save();
  }

  // Obtener carrito por usuario
  async getByUser(userId) {
    return await CartModel.findOne({ user: userId }).populate(
      "products.product"
    );
  }

  // Actualizar carrito completo
  async update(cartId, updateData) {
    return await CartModel.findByIdAndUpdate(cartId, updateData, {
      new: true,
    }).populate("products.product");
  }

  // Vaciar carrito (opcional, útil después de la compra)
  async clearCart(cartId) {
    return await CartModel.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );
  }
}
