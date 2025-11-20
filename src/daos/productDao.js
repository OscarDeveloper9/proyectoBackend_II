import { Product } from "../models/productModel.js";

export class ProductDAO {
  async create(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async getAll() {
    return await Product.find();
  }

  async getById(id) {
    return await Product.findById(id);
  }

  async update(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }
}
