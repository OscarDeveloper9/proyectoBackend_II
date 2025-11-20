import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Ticket = mongoose.model("Ticket", ticketSchema);
