import { CartRepository } from "../repositories/cartRepository.js";
import { ProductRepository } from "../repositories/productRepository.js";

const cartRepo = new CartRepository();
const productRepo = new ProductRepository();

export class CartService {
  static async getCartByUser(userId) {
    let cart = await cartRepo.getByUser(userId);
    if (!cart) {
      cart = await cartRepo.create({ user: userId, products: [] });
    }
    return cart;
  }

  static async addProduct(userId, productId, quantity) {
    const cart = await this.getCartByUser(userId);
    const product = await productRepo.getById(productId);
    if (!product) throw new Error("Producto no encontrado");
    if (product.stock < quantity) throw new Error("Stock insuficiente");

    const existing = cart.products.find(
      (p) => p.product._id.toString() === productId
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: product._id, quantity });
    }
    return await cartRepo.update(cart._id, { products: cart.products });
  }

  static async removeProduct(userId, productId) {
    const cart = await this.getCartByUser(userId);
    cart.products = cart.products.filter(
      (p) => p.product._id.toString() !== productId
    );
    return await cartRepo.update(cart._id, { products: cart.products });
  }
}
