import { TicketDAO } from "../daos/ticketDAO.js";

export class TicketRepository {
  constructor() {
    this.ticketDAO = new TicketDAO();
  }

  async create(data) {
    return await this.ticketDAO.create(data);
  }

  async getAll() {
    return await this.ticketDAO.getAll();
  }

  async getByUser(userId) {
    return await this.ticketDAO.getByUser(userId);
  }
}
