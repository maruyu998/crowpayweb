import { MdateTz } from "maruyu-webcommons/commons/utils/mdate"
import { NotificationType } from "../../../../mtypes/NotificationType"

export default function NotificationCard({
  notification
}:{
  notification: NotificationType
}){

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
      <div className="card-body">
        <p className="m-0 text-sm font-light">{new MdateTz(notification.issuedAt.getTime(),"Asia/Tokyo").format("YYYY/MM/DD HH:mm")}</p>
        <p className="m-0 text-sm font-semibold">{notification.title}</p>
        <p className="m-0 text-sm">{notification.message}</p>
      </div>
    </div>
  )
}