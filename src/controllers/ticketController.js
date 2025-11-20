// src/controllers/ticketController.js
import { PurchaseService } from "../services/purchaseService.js";

export class TicketController {
  // Crear ticket / compra
  static async purchase(req, res) {
    try {
      const ticket = await PurchaseService.purchase(req.user._id);
      res.json(ticket);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Tickets del usuario logueado
  static async getByUser(req, res) {
    try {
      const tickets = await PurchaseService.getTicketsByUser(req.user._id);
      res.json(tickets);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Todos los tickets (solo admin)
  static async getAll(req, res) {
    try {
      const tickets = await PurchaseService.getAllTickets();
      res.json(tickets);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
