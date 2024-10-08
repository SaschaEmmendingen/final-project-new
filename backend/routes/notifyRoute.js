import express from "express";
import { manageNotifications } from "../controllers/notifyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/notifications", protect, manageNotifications); // GET für Benachrichtigungen
router.post("/notifications", protect, manageNotifications); // POST für Benachrichtigungen
router.put("/notifications/replies", protect, manageNotifications); // PUT für Antworten
router.delete("/notifications/:id", protect, manageNotifications); // DELETE für eine Benachrichtigung
router.delete("/notifications/all", protect, manageNotifications); // DELETE für alle Benachrichtigungen

export default router;
