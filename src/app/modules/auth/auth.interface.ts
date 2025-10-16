
export type TAccountStatus = "ACTIVE" | "INACTIVE";

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
};
