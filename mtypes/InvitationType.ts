import mongoose from "mongoose";
import { UserIdType } from "./UserType";

export type InvitationIdType = string;

export type InvitationType = {
  invitationId: InvitationIdType,
  issuerUserId: UserIdType,
  invitationCode: string,
  issuedAt: Date,
  expiredAt: Date,
}

export type InvitationMongoType = 
  InvitationType & {
    _id?: mongoose.Types.ObjectId,
  }

//////////////////////////////////////////////////

export const invitationListMongoProjection:{
  [K in keyof Partial<InvitationMongoType>]: 0|1
} = {
  _id:0, invitationId:1, issuerUserId:1, 
  invitationCode:1, issuedAt:1, expiredAt:1
}