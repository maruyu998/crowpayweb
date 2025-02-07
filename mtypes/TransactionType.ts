import mongoose from "mongoose";
import { UserIdType } from "./UserType";

export type TransactionType = {
  transactionId: string,
  senderUserId: UserIdType,
  receiverUserId: UserIdType,
  content: string,
  amount: number,
  issuerUserId: UserIdType,
  issuedAt: Date,
  accepterUserId: UserIdType,
  acceptedAt: Date,
}

export type TransactionClientType = {
  transactionId: string,
  senderUserId: UserIdType,
  senderUserName: string,
  receiverUserId: UserIdType,
  receiverUserName: string
  content: string,
  amount: number,
  issuerUserId: UserIdType,
  issuedAt: Date,
  accepterUserId: UserIdType,
  acceptedAt: Date,
}

export type TransactionMongoType = 
  TransactionType & {
    _id?: mongoose.Types.ObjectId,
  }

//////////////////////////////////////////////////

export const transactionListMongoProjection:{
  [K in keyof Partial<TransactionMongoType>]: 0|1
} = {
  _id:0, transactionId:1, senderUserId:1, receiverUserId:1, content:1, amount:1,
  issuerUserId:1, issuedAt:1, accepterUserId:1, acceptedAt:1
}

export const transactionItemMongoProjection:{
  [K in keyof Partial<TransactionMongoType>]: 0|1
} = {
  _id:0, transactionId:1, senderUserId:1, receiverUserId:1, content:1, amount:1,
  issuerUserId:1, issuedAt:1, accepterUserId:1, acceptedAt:1
}