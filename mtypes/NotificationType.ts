import mongoose from "mongoose";
import { UserIdType } from "./UserType";

export type NotificationIdType = string;

export type NotificationType = {
  notificationId: NotificationIdType,
  userId: UserIdType,
  title: string,
  message: string,
  read: boolean,
  issuedAt: Date,
}

export type NotificationMongoType = 
  NotificationType & {
    _id?: mongoose.Types.ObjectId,
  }

//////////////////////////////////////////////////

export const notificationListMongoProjection:{
  [K in keyof Partial<NotificationMongoType>]: 0|1
} = {
  _id:0, notificationId:1, userId:1, 
  title:1, message:1, read:1, issuedAt:1 
}