// src/models/productModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  categoria: { type: String },
  imagen: { type: String },
  code: { type: String, unique: true, required: true },
});

export const Product = mongoose.model("Product", productSchema);
