import { Ticket } from "../models/ticketModel.js";

export class TicketDAO {
  async create(ticketData) {
    const ticket = new Ticket(ticketData);
    return await ticket.save();
  }

  async getAll() {
    return await Ticket.find().populate("user").populate("products.product");
  }

  async getByUser(userId) {
    return await Ticket.find({ user: userId }).populate("products.product");
  }
}
