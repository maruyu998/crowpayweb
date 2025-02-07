import mongoose from "mongoose";
import { WalletIdType } from "./WalletType";

export type UserIdType = string;

export type UserType = {
  userId: UserIdType,
  userName: string,
  passwordHash: string,
  inviterUserId?: UserIdType,
  registeredAt: Date,
  lastEditedAt: Date,
  amount: number,
  walletIdList: WalletIdType[],
}

export type UserClientType = Omit<UserType, "passwordHash">

export type UserGraphType = {
  userId: UserIdType,
  userDisplayName: string,
  amount: number,
  walletNames: string[]
}

export type UserMongoType = 
  UserType & {
    _id?: mongoose.Types.ObjectId,
  }

//////////////////////////////////////////////////

// export const friendListMongoProjection:{
//   [K in keyof Partial<UserMongoType>]: 0|1
// } = {
//   _id:0, userId:1, userName:1, inviterUserId:1, amount:1, wallets:1
// }