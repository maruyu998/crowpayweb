import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { NotificationType } from '../../mtypes/NotificationType';

export const NotificationModel = mongoose.model<NotificationType>("notification", 
  (()=>{
    const schema = new mongoose.Schema<NotificationType>({
      notificationId: {
        type: String,
        unique: true,
        required: true,
        default: ()=>uuidv4()
      },
      userId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      read: {
        type: Boolean,
        required: true,
        default: false,
      },
      issuedAt: {
        type: Date,
        required: true,
        default: ()=>new Date()
      }
    }, {
      timestamps: true
    })
    return schema
  })()
);