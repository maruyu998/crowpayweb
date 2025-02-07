import React, { useEffect } from "react";
import Topbar from "../components/Topbar";
import { useUserInfo } from "../contexts/UserInfoProvider";
import NotificationCard from "../components/notification/NotificationCard";

export default function NotificationPage(){

  const { user, notificationList, refreshNotificationList } = useUserInfo();
  useEffect(()=>{ 
    if(user == null) return;
    refreshNotificationList();
  }, [user])

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="container mx-auto max-w-md pb-20 mt-4 px-4">
        <h1 className="text-2xl">Notifications</h1>
        <div className="flex flex-col gap-2 my-2">
          {notificationList.map(notification=>(
            <NotificationCard key={notification.notificationId} notification={notification} />
          ))}
        </div>
      </div>
    </div>
  );
}