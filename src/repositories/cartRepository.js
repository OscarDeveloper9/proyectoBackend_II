import { CartModel } from "../models/cartModel.js";

export class CartRepository {
  async create(data) {
    return await CartModel.create(data);
  }

  async getById(id) {
    return await CartModel.findById(id).populate("products.product");
  }

  async getByUser(userId) {
    return await CartModel.findOne({ user: userId }).populate(
      "products.product"
    );
  }

  async update(id, data) {
    return await CartModel.findByIdAndUpdate(id, data, { new: true });
  }
}
