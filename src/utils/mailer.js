import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS, FRONTEND_URL } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendRecoveryEmail = async (to, token) => {
  const url = `${FRONTEND_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: EMAIL_USER,
    to,
    subject: "Recuperación de contraseña",
    html: `<p>Haz clic en el botón para restablecer tu contraseña:</p>
               <a href="${url}"><button>Restablecer contraseña</button></a>`,
  });
};
