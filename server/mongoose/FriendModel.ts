import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { FriendMongoType, FriendType } from '../../mtypes/FriendType';

export const FriendModel = mongoose.model<FriendMongoType>("friend", 
  (()=>{
    const schema = new mongoose.Schema<FriendMongoType>({
      userId: {
        type: String,
        required: true,
      },
      friendUserId: {
        type: String,
        required: true,
      },
      accepted: {
        type: Boolean,
        required: true,
        default: false
      },
      dealCount: {
        type: Number,
        required: true,
        default: 0
      },
      lastDealedAt: {
        type: Date,
        default: null
      }
    }, {
      timestamps: true
    })
    return schema
  })()
);