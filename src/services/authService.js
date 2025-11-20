// src/services/authService.js
import { UserRepository } from "../repositories/userRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

const userRepo = new UserRepository();

// Hash password
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Compare password
export async function comparePassword(password, hashed) {
  return await bcrypt.compare(password, hashed);
}

// Generate JWT
export function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, {
    expiresIn: "1d",
  });
}

// Generate reset token (para forgot-password)
export function generateResetToken() {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
}

// Save reset token en DB
export async function saveResetToken(userId, token, expiration) {
  return await userRepo.saveResetToken(userId, token, expiration);
}

// Send reset email (simulado)
export async function sendResetEmail(email, token) {
  console.log(`Enviando email a ${email} con token: ${token}`);
  return true;
}

// Register user
export async function registerUser({ username, email, password, role }) {
  const existing = await userRepo.getByEmail(email);
  if (existing) throw new Error("Usuario ya existe");

  const hashedPassword = await hashPassword(password);
  return await userRepo.create({
    username,
    email,
    password: hashedPassword,
    role: role || "usuario",
  });
}

// Login user
export async function loginUser(email, password) {
  const user = await userRepo.getByEmail(email);
  if (!user) throw new Error("Credenciales inválidas");

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error("Credenciales inválidas");

  const token = generateToken(user);
  return { user, token };
}
