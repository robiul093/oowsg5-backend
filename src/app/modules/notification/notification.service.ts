import { Notification_Model } from "./notification.schema";
import { TNotification } from "./notification.interface";

export const NotificationService = {
  // Save notification after sending
  async createNotification(data: TNotification) {
    return await Notification_Model.create(data);
  },

  // Fetch all notifications for a specific user
  async getUserNotifications(userId: string) {
    return await Notification_Model.find({ userId })
      .populate("eventId", "title time voice_url")
      .sort({ createdAt: -1 });
  },

  // Mark notification as read
  async markAsRead(notificationId: string) {
    return await Notification_Model.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  },
};
