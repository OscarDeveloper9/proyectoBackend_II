// src/services/productService.js
import { ProductRepository } from "../repositories/productRepository.js";
import { ProductDTO } from "../dtos/productDTO.js";
import generateCode from "../utils/generateCode.js"; // <-- importamos la función

const productRepo = new ProductRepository();

export class ProductService {
  static async getAllProducts() {
    const products = await productRepo.getAll();
    return products.map((p) => new ProductDTO(p));
  }

  static async getProductById(id) {
    const product = await productRepo.getById(id);
    if (!product) throw new Error("Producto no encontrado");
    return new ProductDTO(product);
  }

  static async createProduct(data) {
    if (!data.nombre || !data.precio)
      throw new Error("Nombre y precio son obligatorios");

    // Generar un código único automáticamente
    data.code = generateCode();

    const product = await productRepo.create(data);
    return new ProductDTO(product);
  }

  static async updateProduct(id, data) {
    const updated = await productRepo.update(id, data);
    if (!updated) throw new Error("No se pudo actualizar el producto");
    return new ProductDTO(updated);
  }

  static async deleteProduct(id) {
    const deleted = await productRepo.delete(id);
    if (!deleted) throw new Error("No se pudo eliminar el producto");
    return deleted;
  }
}
