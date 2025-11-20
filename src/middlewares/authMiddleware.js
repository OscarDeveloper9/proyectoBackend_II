import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository.js";
import { config } from "../config/env.js";

const userRepo = new UserRepository();

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No autorizado" });

    const payload = jwt.verify(token, config.jwtSecret);
    const user = await userRepo.getById(payload.id);
    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

export const roleMiddleware = (allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: "No autorizado" });
  if (!allowedRoles.includes(req.user.role))
    return res.status(403).json({ msg: "No tienes permiso para esta acción" });
  next();
};
