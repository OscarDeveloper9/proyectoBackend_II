import { Cart } from "../models/cartModel.js";

export class CartDAO {
  async create(cartData) {
    const cart = new Cart(cartData);
    return await cart.save();
  }

  async getByUser(userId) {
    return await Cart.findOne({ user: userId }).populate("products.product");
  }

  async update(id, updateData) {
    return await Cart.findByIdAndUpdate(id, updateData, { new: true }).populate(
      "products.product"
    );
  }
}
