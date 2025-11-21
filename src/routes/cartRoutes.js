import express from "express";
import CartController from "../controllers/cartController.js";
import {
  authMiddleware,
  roleMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, CartController.getCart);
router.post(
  "/add",
  authMiddleware,
  roleMiddleware(["usuario"]),
  CartController.addProduct
);
router.post(
  "/remove",
  authMiddleware,
  roleMiddleware(["usuario"]),
  CartController.removeProduct
);

export default router;
