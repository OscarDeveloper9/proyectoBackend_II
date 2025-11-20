import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Rutas
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ ERROR: Falta la variable MONGO_URI en .env");
  process.exit(1);
}
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("🟢 Base de datos conectada correctamente"))
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err.message);
    process.exit(1);
  });

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/tickets", ticketRoutes);

// Handler global de errores
app.use((err, req, res, next) => {
  console.error("🔥 Error global:", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Error interno del servidor",
  });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
