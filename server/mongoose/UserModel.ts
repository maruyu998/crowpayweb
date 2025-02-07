import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
import { LOWER_ALPHABET } from "maruyu-webcommons/commons/utils/character";
import { UserType } from '../../mtypes/UserType';

export const UserModel = mongoose.model<UserType>("user", 
  (()=>{
    const schema = new mongoose.Schema<UserType>({
      userId: {
        type: String,
        required: true,
        unique: true,
        default: ()=>customAlphabet(LOWER_ALPHABET, 10)()
      },
      userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
      },
      passwordHash: {
        type: String,
        required: true
      },
      inviterUserId: {
        type: String,
      },
      registeredAt: {
        type: Date,
        required: true,
        default: ()=>new Date()
      },
      lastEditedAt: {
        type: Date,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        default: 0
      },
      walletIdList: [{
        type: String,
      }]
    }, {
      timestamps: true
    })
    return schema
  })()
);