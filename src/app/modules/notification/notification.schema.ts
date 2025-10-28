import { model, Schema } from "mongoose";
import { TNotification } from "./notification.interface";

const notificationSchema = new Schema<TNotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "userId is required"],
      ref: "User",
    },
    eventId: {
      type: Schema.Types.ObjectId,
      required: [true, "eventId is required"],
      ref: "Event",
    },
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "message is required"],
      trim: true,
    },
    voice_url: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Notification_Model = model<TNotification>("Notification", notificationSchema);
