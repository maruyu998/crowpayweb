import { getPacket } from "maruyu-webcommons/commons/utils/fetch";
import { WalletType } from "../../../mtypes/WalletType";

export async function getWalletList():Promise<WalletType[]>{
  const url = new URL("/api/v1/wallet/list", window.location.href);
  return getPacket(url.toString())
        .then(({title, message, data})=>{
          if (typeof data != "object") throw new Error("data is not object");
          if (!("walletList" in (data as object))) throw new Error("walletList is not found");
          const walletList = (data as {walletList: WalletType[]}).walletList;
          return walletList;
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}