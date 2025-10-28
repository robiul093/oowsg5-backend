import { Types } from "mongoose";

export interface TNotification {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  title: string;
  message: string;
  voice_url?: string;
  isRead?: boolean;
  createdAt?: Date;
}
