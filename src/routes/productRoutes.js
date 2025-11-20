import express from "express";
import { ProductController } from "../controllers/productController.js";
import {
  authMiddleware,
  roleMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  ProductController.create
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  ProductController.update
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  ProductController.delete
);

export default router;
