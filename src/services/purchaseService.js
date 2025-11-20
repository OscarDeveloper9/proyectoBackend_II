import { TicketRepository } from "../repositories/ticketRepository.js";
import { CartRepository } from "../repositories/cartRepository.js";
import generateCode from "../utils/generateCode.js";

const ticketRepo = new TicketRepository();
const cartRepo = new CartRepository();

export class PurchaseService {
  static async purchase(userId) {
    const cart = await cartRepo.getByUser(userId);
    if (!cart || cart.products.length === 0) throw new Error("Carrito vacío");

    let total = 0;
    const purchasedProducts = cart.products.map((item) => {
      total += item.quantity * item.product.precio;
      return { product: item.product._id, quantity: item.quantity };
    });

    const ticket = await ticketRepo.create({
      codigo: generateCode(),
      usuario: userId,
      productos: purchasedProducts,
      total,
    });

    // Vaciar carrito después de la compra
    cart.products = [];
    await cartRepo.update(cart._id, { products: [] });

    return ticket;
  }

  // Nuevo: tickets del usuario
  static async getTicketsByUser(userId) {
    return await ticketRepo.getByUser(userId);
  }

  // Nuevo: todos los tickets (admin)
  static async getAllTickets() {
    return await ticketRepo.getAll();
  }
}
