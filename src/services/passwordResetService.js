import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config/env.js";
import { UserRepository } from "../repositories/userRepository.js";
import { MailService } from "./mailService.js";

const userRepo = new UserRepository();

export class PasswordResetService {
  static async requestReset(email) {
    const user = await userRepo.getByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");

    const resetToken = jwt.sign({ id: user._id }, config.jwtSecret, {
      expiresIn: config.resetPasswordExpiration,
    });

    const link = `${config.frontendURL}/reset-password?token=${resetToken}`;

    await userRepo.saveResetToken(
      user._id,
      resetToken,
      Date.now() + config.resetPasswordExpiration * 1000
    );

    await MailService.sendResetEmail(user.email, link);
  }

  static async resetPassword(token, newPassword) {
    let payload;
    try {
      payload = jwt.verify(token, config.jwtSecret);
    } catch {
      throw new Error("Token inválido o expirado");
    }

    const user = await userRepo.getById(payload.id);
    if (!user) throw new Error("Usuario no encontrado");

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) throw new Error("No puedes usar la misma contraseña anterior");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await userRepo.updatePassword(user._id, hashedPassword);
  }
}
