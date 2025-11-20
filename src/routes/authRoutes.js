import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/current", authMiddleware, AuthController.current);

// Rutas para recuperación de contraseña
router.post("/forgot", AuthController.forgotPassword);
router.post("/reset", AuthController.resetPassword);

export default router;
