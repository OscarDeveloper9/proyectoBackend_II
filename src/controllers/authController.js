import { UserRepository } from "../repositories/userRepository.js";
import { CartRepository } from "../repositories/cartRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

const userRepo = new UserRepository();
const cartRepo = new CartRepository();

export class AuthController {
  static async register(req, res) {
    try {
      const { username, email, password, role } = req.body;
      const existing = await userRepo.getByEmail(email);
      if (existing) return res.status(400).json({ msg: "Usuario ya existe" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userRepo.create({
        username,
        email,
        password: hashedPassword,
        role: role || "usuario",
      });

      // Crear carrito automáticamente
      const cart = await cartRepo.create({ user: user._id, products: [] });
      user.cart = cart._id;
      await userRepo.update(user._id, { cart: cart._id });

      const token = jwt.sign({ id: user._id }, config.jwtSecret, {
        expiresIn: "1d",
      });

      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userRepo.getByEmail(email);
      if (!user) return res.status(400).json({ msg: "Usuario no encontrado" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ msg: "Contraseña incorrecta" });

      const token = jwt.sign({ id: user._id }, config.jwtSecret, {
        expiresIn: "1d",
      });
      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async current(req, res) {
    try {
      const user = req.user;
      res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
