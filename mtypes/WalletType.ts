import mongoose from "mongoose";

export type WalletIdType = string;

export type WalletType = {
  walletId: WalletIdType,
  walletName: string,
}

export type WalletMongoType = 
  WalletType & {
    _id?: mongoose.Types.ObjectId,
  }

//////////////////////////////////////////////////

export const walletListMongoProjection:{
  [K in keyof Partial<WalletMongoType>]: 0|1
} = {
  _id:0, walletId:1, walletName:1
}