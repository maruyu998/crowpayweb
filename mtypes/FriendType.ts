import mongoose from "mongoose";
import { UserIdType } from "./UserType";

export type FriendType = {
  userId: UserIdType,
  friendUserId: UserIdType,
  accepted: boolean,
  dealCount: number,
  lastDealedAt?: Date,
}

type FriendClientCommonType = {
  friendUserId: string, // frined user id
  friendUserName: string, // friend user name
  status: "friend"|"requested"|"requesting",
  inviterUserId?: string
  inviterUserName?: string,
  amount: number|null,
  walletIdList: string[]|null,
  dealCount: number,
  lastDealedAt?: Date,
}

type FriendFriendClientType = FriendClientCommonType & {
  status: "friend",
  amount: number,
  walletIdList: string[]|null,
}
type FriendRequestedClientType = FriendClientCommonType & {
  status: "requested",
  amount: null,
  walletIdList: null,
}
type FriendRequesting = FriendClientCommonType & {
  status: "requesting",
  amount: null,
  walletIdList: null,
}

export type FriendClientType = FriendFriendClientType 
                              | FriendRequestedClientType 
                              | FriendRequesting;

export type FriendMongoType = 
  FriendType & {
    _id?: mongoose.Types.ObjectId,
  }

export type FriendGraphType = {
  userId: UserIdType,
  friendUserId: UserIdType,
}

//////////////////////////////////////////////////

export const friendListMongoProjection:{
  [K in keyof Partial<FriendMongoType>]: 0|1
} = {
  _id:0, userId:1, friendUserId:1, 
  accepted:1, dealCount:1, lastDealedAt:1
}