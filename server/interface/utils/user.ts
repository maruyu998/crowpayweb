import { sum } from "maruyu-webcommons/commons/utils/number";
import { TransactionModel } from "../../mongoose/TransactionModel"

export async function calculateAmount({
  userId
}:{
  userId: string
}){
  const positiveTransactions = await TransactionModel.find({receiverUserId:userId, acceptedAt:{$ne:null}});
  const negativeTransactions = await TransactionModel.find({senderUserId:userId, acceptedAt:{$ne:null}});
  const amount = sum(positiveTransactions.map(t=>t.amount)) - sum(negativeTransactions.map(t=>t.amount));
  return amount;
}

export async function getUserDictFromIdSet(userIdSet:Set<string>, fieldNames:string[]){
  
}