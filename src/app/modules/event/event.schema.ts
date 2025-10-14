import { model, Schema } from "mongoose";
import { TEvent } from "./event.interface";

const eventSchema = new Schema<TEvent>(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },
    time: {
      type: Date,
      required: [true, "time is required"],
    },
    alarm: {
      type: Date,
      required: [true, "alarm is required"],
    },
    color: {
      type: String,
      required: [true, "color is required"],
    },
    status: {
      type: String,
      enum: ["upcoming", "complete", "missed"],
      default: "upcoming",
    },
    userId: {
      type: Schema.ObjectId,
      required: [true, "user id is required"],
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Event_Model = model<TEvent>("Event", eventSchema);
