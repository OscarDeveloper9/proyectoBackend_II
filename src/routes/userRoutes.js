// src/routes/userRoutes.js
import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
  sendResetEmail,
  generateResetToken,
  saveResetToken,
} from "../services/authService.js";

const router = express.Router();
const userRepo = new UserRepository();

// Middleware JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No autorizado" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ msg: "Token inválido" });
    req.user = user;
    next();
  });
};

// REGISTER
router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ msg: errors.array() });

    const { username, email, password, role } = req.body;
    const existing = await userRepo.getByEmail(email);
    if (existing) return res.status(400).json({ msg: "Usuario ya existe" });

    const hashedPassword = await hashPassword(password);
    const newUser = await userRepo.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    const token = generateToken(newUser);

    res.json({ token });
  }
);

// LOGIN
router.post(
  "/login",
  body("email").isEmail(),
  body("password").exists(),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await userRepo.getByEmail(email);
    if (!user) return res.status(400).json({ msg: "Usuario no encontrado" });

    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(400).json({ msg: "Contraseña incorrecta" });

    const token = generateToken(user);
    res.json({ token });
  }
);

// CURRENT
router.get("/current", authenticateToken, async (req, res) => {
  const user = await userRepo.getById(req.user.id);
  if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

  // DTO: solo campos necesarios
  const userDTO = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
  res.json(userDTO);
});

// FORGOT PASSWORD
router.post("/forgot-password", body("email").isEmail(), async (req, res) => {
  const { email } = req.body;
  const user = await userRepo.getByEmail(email);
  if (!user) return res.status(400).json({ msg: "Usuario no encontrado" });

  const token = generateResetToken();
  const expiration =
    Date.now() + parseInt(process.env.RESET_PASSWORD_EXPIRATION) * 1000;
  await userRepo.saveResetToken(user._id, token, expiration);

  await sendResetEmail(user.email, token);
  res.json({ msg: "Enlace de recuperación enviado" });
});

// RESET PASSWORD
router.post(
  "/reset-password/:token",
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await userRepo.getByResetToken(token);
    if (!user)
      return res.status(400).json({ msg: "Token inválido o expirado" });

    const hashedPassword = await hashPassword(password);

    // Evitar misma contraseña anterior
    const isSame = await comparePassword(password, user.password);
    if (isSame)
      return res
        .status(400)
        .json({ msg: "No puedes usar la misma contraseña" });

    await userRepo.updatePassword(user._id, hashedPassword);
    res.json({ msg: "Contraseña actualizada correctamente" });
  }
);

export default router;
