import nodemailer from "nodemailer";
import { config } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.emailUser,
    pass: config.emailPass, // App Password recomendado
  },
});

export class MailService {
  static async sendResetEmail(email, link) {
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "Recuperación de contraseña",
      html: `<p>Haz clic en el botón para restablecer tu contraseña:</p>
             <a href="${link}" style="padding:10px 20px;background:#007bff;color:white;border-radius:5px;text-decoration:none;">Restablecer Contraseña</a>
             <p>Este enlace expirará en 1 hora.</p>`,
    };
    return transporter.sendMail(mailOptions);
  }
}
