import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  resetPasswordExpiration:
    parseInt(process.env.RESET_PASSWORD_EXPIRATION) || 3600,
  frontendURL: process.env.FRONTEND_URL || "http://localhost:3000",
};
