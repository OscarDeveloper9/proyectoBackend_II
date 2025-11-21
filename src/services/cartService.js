// src/services/cartService.js
import { CartDAO } from "../daos/cartDao.js";
import { ProductDAO } from "../daos/productDao.js";

const cartDAO = new CartDAO();
const productDAO = new ProductDAO();

export default class CartService {
  static async getCartByUser(userId) {
    let cart = await cartDAO.getByUser(userId);
    if (!cart) {
      cart = await cartDAO.create({ user: userId, products: [] });
    }
    return cart;
  }

  static async addProduct(userId, productId, quantity) {
    if (!productId) throw new Error("Producto inválido");
    if (!quantity || quantity <= 0) throw new Error("Cantidad inválida");

    const product = await productDAO.getById(productId);
    if (!product) throw new Error("Producto no encontrado");

    let cart = await cartDAO.getByUser(userId);
    if (!cart) cart = await cartDAO.create({ user: userId, products: [] });

    const existing = cart.products.find(
      (p) => p.product.toString() === productId.toString()
    );
    if (existing) existing.quantity += quantity;
    else cart.products.push({ product: productId, quantity });

    return await cartDAO.update(cart._id, { products: cart.products });
  }

  static async removeProduct(userId, productId) {
    let cart = await cartDAO.getByUser(userId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId.toString()
    );
    return await cartDAO.update(cart._id, { products: cart.products });
  }

  static async clearCart(userId) {
    let cart = await cartDAO.getByUser(userId);
    if (!cart) throw new Error("Carrito no encontrado");

    return await cartDAO.update(cart._id, { products: [] });
  }
}
