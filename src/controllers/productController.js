// src/controllers/productController.js
import { ProductService } from "../services/productService.js";

export class ProductController {
  static async getAll(req, res) {
    try {
      const products = await ProductService.getAllProducts();
      res.json(products);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      res.json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const product = await ProductService.updateProduct(
        req.params.id,
        req.body
      );
      res.json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.json({ mensaje: "Producto eliminado" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
