import { model, Schema } from "mongoose";
import { TNotification } from "./notification.interface";

const notificationSchema = new Schema<TNotification>({
  userId: {
    type: Schema.ObjectId,
    required: [true, "userId is required"],
    ref: "User",
  },
  eventId: {
    type: Schema.ObjectId,
    required: [true, "eventId is required"],
    ref: "Event",
  },
});

export const Notification_Model = model<TNotification>("Notification", notificationSchema);
