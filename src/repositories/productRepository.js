import { ProductDAO } from "../daos/productDAO.js";

export class ProductRepository {
  constructor() {
    this.productDAO = new ProductDAO();
  }

  async create(data) {
    return await this.productDAO.create(data);
  }

  async getAll() {
    return await this.productDAO.getAll();
  }

  async getById(id) {
    return await this.productDAO.getById(id);
  }

  async update(id, data) {
    return await this.productDAO.update(id, data);
  }

  async delete(id) {
    return await this.productDAO.delete(id);
  }
}
