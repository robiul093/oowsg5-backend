import { ObjectId } from "mongoose";

export type TEventStatus = "upcoming" | "complete" | "missed";

export type TEvent = {
  title: string;
  description: string;
  time: Date;
  alarm: Date;
  color: string;
  status: TEventStatus;
  userId: ObjectId;
  isDeleted: Boolean;
  timezone: string;
};
