import { Router } from "express";
import { TicketController } from "../controllers/ticketController.js";
import {
  authMiddleware,
  roleMiddleware,
} from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/purchase", authMiddleware, TicketController.purchase);
router.get("/mytickets", authMiddleware, TicketController.getByUser);
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  TicketController.getAll
);

export default router;
