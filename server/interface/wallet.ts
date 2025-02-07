import { walletListMongoProjection, WalletType } from "../../mtypes/WalletType";
import { WalletModel } from "../mongoose/WalletModel";

export async function getWalletList():Promise<WalletType[]>{
  const walletList = await WalletModel.find({}, walletListMongoProjection).lean();
  return walletList;
}