import { Request, Response } from "express";
import { NotificationService } from "./notification.service";

export const NotificationController = {
  // Store notification after sending
  async create(req: Request, res: Response) {
    try {
      const notification = await NotificationService.createNotification(req.body);
      res.status(201).json({
        success: true,
        message: "Notification saved successfully",
        data: notification,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get user notifications
  async getByUser(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      console.log(req.user);
      const notifications = await NotificationService.getUserNotifications(userId);
      res.status(200).json({
        success: true,
        message: "Notifications fetched successfully",
        data: notifications,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Mark notification as read
  async markRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await NotificationService.markAsRead(id);
      res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
