import { Router } from "express";
import { NotificationController } from "./notification.controller";
import auth from "../../middlewares/auth";

const router = Router();

// POST: Save a new notification
router.post("/", NotificationController.create);

// GET: Get all notifications for a user
router.get("/", auth(), NotificationController.getByUser);

// PUT: Mark a notification as read
router.put("/read/:id", auth(), NotificationController.markRead);

export const NotificationRoute = router;
