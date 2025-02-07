import { getPacket } from "maruyu-webcommons/commons/utils/fetch";
import { NotificationType } from "../../../mtypes/NotificationType";

export async function getNotificationList():Promise<NotificationType[]>{
  const url = new URL("/api/v1/notification/list", window.location.href);
  return getPacket(url.toString())
        .then(({title, message, data})=>{
          if (typeof data != "object") throw new Error("data is not object");
          if (!("notificationList" in (data as object))) throw new Error("notificationList is not found");
          const notificationList = (data as {notificationList: NotificationType[]}).notificationList;
          return notificationList;
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}
