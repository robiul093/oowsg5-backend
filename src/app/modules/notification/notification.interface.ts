import { ObjectId } from "mongoose";

export type TNotification = {
  userId: ObjectId;
  eventId: ObjectId;
};
