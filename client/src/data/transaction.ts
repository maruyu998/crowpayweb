import { deletePacket, getPacket, postPacket, putPacket } from "maruyu-webcommons/commons/utils/fetch";
import { TransactionClientType } from "../../../mtypes/TransactionType";

export async function getTransactionList():Promise<TransactionClientType[]>{
  const url = new URL("/api/v1/transaction/list", window.location.href);
  return getPacket(url.toString())
        .then(({title, message, data})=>{
          if (typeof data != "object") throw new Error("data is not object");
          if (!("transactionList" in (data as object))) throw new Error("transactionList is not found");
          const transactionList = (data as {transactionList: TransactionClientType[]}).transactionList;
          return transactionList;
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}

export async function issueTransaction({
  receiverUserId,
  senderUserId,
  content,
  amount,
}:{
  receiverUserId: string,
  senderUserId: string,
  amount: number,
  content: string,
}):Promise<void>{
  const addObject = { receiverUserId, senderUserId, content, amount };
  return postPacket("/api/v1/transaction/issue", addObject)
        .then(({title, message, data})=>{
          // if (typeof data != "object") throw new Error("data is not object");
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}

export async function acceptTransaction({
  transactionId
}:{
  transactionId: string
}):Promise<void>{
  return putPacket("/api/v1/transaction/accept", { transactionId })
        .then(({title, message, data})=>{
          // if (typeof data != "object") throw new Error("data is not object");
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}

export async function declineTransaction({
  transactionId
}:{
  transactionId: string
}):Promise<void>{
  return deletePacket("/api/v1/transaction/decline", { transactionId })
        .then(({title, message, data})=>{
          if (typeof data != "object") throw new Error("data is not object");
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}

export async function cancelTransaction({
  transactionId
}:{
  transactionId: string
}):Promise<void>{
  return deletePacket("/api/v1/transaction/cancel", { transactionId })
        .then(({title, message, data})=>{
          if (typeof data != "object") throw new Error("data is not object");
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}