import { NotificationModel } from "../mongoose/NotificationModel";
import { notificationListMongoProjection } from "../../mtypes/NotificationType";

export async function getNotificationList({
  userId,
}:{
  userId: string,
}){
  const notificationList = await NotificationModel.find(
    {userId}, notificationListMongoProjection
  ).sort({ issuedAt: -1 }).lean();
  return notificationList;
}