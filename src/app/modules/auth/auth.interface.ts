import { ObjectId } from "mongoose";

export type TAccountStatus = "ACTIVE" | "INACTIVE";
export type TSubscriptionStatus =
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused"
  | "none";

export type TUser = {
  fullName: string;
  email: string;
  password?: string;
  profileImage?: string;
  isVerified?: boolean;
  lastOTP?: string;
  fcmToken: string;
  isActive?: TAccountStatus;
  isDeleted?: boolean;

  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: TSubscriptionStatus;
  subscribedPlanId?: ObjectId;
  trialEndsAt: Date;
};
