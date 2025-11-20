import { CartService } from "../services/cartService.js";

export class CartController {
  // Obtener carrito del usuario autenticado
  static async getCart(req, res) {
    try {
      const cart = await CartService.getCartByUser(req.user._id);
      res.json(cart);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Agregar producto al carrito
  static async addProduct(req, res) {
    try {
      const { productId, quantity } = req.body;
      const cart = await CartService.addProduct(
        req.user._id,
        productId,
        quantity
      );
      res.json(cart);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Quitar producto del carrito
  static async removeProduct(req, res) {
    try {
      const { productId } = req.body;
      const cart = await CartService.removeProduct(req.user._id, productId);
      res.json(cart);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
