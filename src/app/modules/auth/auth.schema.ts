import { Schema, model } from "mongoose";
import { TUser } from "./auth.interface";

const userSchema = new Schema<TUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    profileImage: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastOTP: {
      type: String,
      default: "",
    },
    fcmToken: {
      type: String,
      required: false,
    },
    isActive: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // payment related
    planName: {
      type: String,
      enum: ["Free Plan", "Premium Plan", "Platinum Plan"],
      default: "Free Plan",
    },
    stripeCustomerId: { type: String },
    subscriptionId: { type: String },
    subscribedPlanId: {
      type: Schema.ObjectId,
      ref: "Plan",
    },
    subscriptionStatus: {
      type: String,
      enum: [
        "incomplete",
        "incomplete_expired",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
        "paused",
        "none",
      ],
      default: "none",
    },
    trialEndsAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User_Model = model<TUser>("User", userSchema);
