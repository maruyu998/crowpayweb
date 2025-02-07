import { PopulateOptions } from "mongoose";
import { TransactionModel } from "../mongoose/TransactionModel";
import { TransactionClientType, transactionItemMongoProjection, transactionListMongoProjection } from "../../mtypes/TransactionType";
import { isFriend } from "./utils/friend";
import { AuthenticationError, InvalidParamError, UnexpectedError } from "maruyu-webcommons/node/errors";
import { UserModel } from "../mongoose/UserModel";
import { calculateAmount } from "./utils/user";
import * as webpush from "./utils/webpush";
import { Mdate, MdateTz } from "maruyu-webcommons/commons/utils/mdate";
import { FriendModel } from "../mongoose/FriendModel";

export async function getTransactionList({
  userId,
}:{
  userId: string,
}):Promise<TransactionClientType[]>{
  const transactionList = await TransactionModel.find({
    $or: [{senderUserId: userId}, {receiverUserId: userId}]
  }, transactionListMongoProjection).sort({issuedAt:-1}).lean();

  const userIdList = Array.from(new Set([...transactionList.map(t=>t.senderUserId), ...transactionList.map(t=>t.receiverUserId)]));
  const userNameList = await Promise.all(userIdList.map(async userId=>UserModel.findOne({userId}).lean().then(user=>user?.userName??null)));
  const userDict:Record<string,string> = {}
  for(let i=0; i<userIdList.length; i++) {
    const userName = userNameList[i];
    if(userName == null) throw new UnexpectedError("userName is null");
    userDict[userIdList[i]] = userName;
  }
  const transactionClientList = transactionList.map(transaction=>{
    const { transactionId, content, amount, issuedAt, acceptedAt, senderUserId, receiverUserId, issuerUserId, accepterUserId } = transaction;
    const senderUserName = userDict[senderUserId];
    const receiverUserName = userDict[receiverUserId];
    return { 
      transactionId, content, amount, issuedAt, acceptedAt, senderUserName, receiverUserName, 
      issuerUserId, accepterUserId, senderUserId, receiverUserId,
    } as TransactionClientType;
  });
  return transactionClientList;
}

export async function issueTransaction({
  issuerUserId,
  accepterUserId,
  receiverUserId, 
  senderUserId, 
  amount, 
  content,
}:{
  issuerUserId: string,
  accepterUserId: string,
  receiverUserId: string,
  senderUserId: string,
  amount: number,
  content: string,
}){
  if(!Number.isInteger(amount)) throw new InvalidParamError("amount must be integer.");
  if(amount <= 0) throw new InvalidParamError("amount must be positive.");
  if(amount > 200000) throw new InvalidParamError('invalid request. amount is too large.');
  if(receiverUserId == senderUserId) throw new InvalidParamError(`receiverUserId and senderUserId must be different.`);
  if(receiverUserId != issuerUserId && senderUserId != issuerUserId) throw new InvalidParamError(`receiverUserId or senderUserId must be issuerUserId`);
  if(!(await isFriend(receiverUserId, senderUserId))) throw new AuthenticationError(`${receiverUserId} and ${senderUserId} is not friend.`);
  const transaction = await TransactionModel.create({
    receiverUserId, 
    senderUserId, 
    content,
    amount, 
    issuerUserId, 
    issuedAt: new Date(),
    accepterUserId
  });
  if(transaction == null) throw new Error("[issueTransaction] Issue Transaction is failed.");
  webpush.sendRequestForAcceptTransaction(transaction);
  return transaction.toJSON();
}

export async function acceptTransaction({
  accepterUserId,
  transactionId,
}:{
  accepterUserId: string,
  transactionId: string,
}){

  const transaction = await TransactionModel.findOneAndUpdate(
    { accepterUserId, transactionId, acceptedAt:null }, 
    { acceptedAt: new Date() },
    { new:true, upsert:false }
  ).select(transactionItemMongoProjection).lean();
  if(transaction == null) throw new Error(`transaction is not found. transactionId=${transactionId}`);

  const senderUser = await UserModel.findOne({ userId: transaction.senderUserId });
  if(senderUser == null) throw new UnexpectedError("sender user is not found.");
  const receiverUser = await UserModel.findOne({ userId: transaction.receiverUserId });
  if(receiverUser == null) throw new UnexpectedError("receiver user is not found.");
  
  const senderAmount = await calculateAmount({ userId: transaction.senderUserId });
  const receiverAmount = await calculateAmount({ userId: transaction.receiverUserId });
  await senderUser.updateOne({amount: senderAmount});
  await receiverUser.updateOne({amount: receiverAmount});
  await FriendModel.findOneAndUpdate(
    {
      $or: [
        { userId: senderUser.userId, friendUserId: receiverUser.userId, accepted: true },
        { userId: receiverUser.userId, friendUserId: senderUser.userId, accepted: true },
      ]
    }, 
    { $set: { lastDealedAt: new Date() }, $inc: { dealCount: 1 } }
  )

  if(senderAmount != senderUser.amount - transaction.amount){
    console.error(`=========================================`);
    console.error(Mdate.now().toTz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss"));
    console.error(`Fatal Error. Sender Sum is not match. `);
    console.error(`Sender: id=${senderUser.id} name=${senderUser.userName}`);
    console.error(`calculatedAmount=${senderAmount} oldAmount=${senderUser.amount} transactionAmount=${transaction.amount}`);
    console.error(`=========================================`);
  }
  if(receiverAmount != receiverUser.amount + transaction.amount){
    console.error(`=========================================`);
    console.error(Mdate.now().toTz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss"));
    console.error(`Fatal Error. Receiver Sum is not match.`);
    console.error(`Receiver: id=${receiverUser.id} name=${receiverUser.userName}`);
    console.error(`calculatedAmount=${receiverAmount} oldAmount=${receiverUser.amount} transactionAmount=${transaction.amount}`);
    console.error(`=========================================`);
  }
  webpush.sendMessageForAcceptTransaction(transaction);
  return transaction;
}

export async function declineTransaction({
  accepterUserId,
  transactionId,
}:{
  accepterUserId: string,
  transactionId: string,
}){
  const transaction = await TransactionModel.findOneAndDelete(
    { accepterUserId, transactionId, acceptedAt: null }
  ).select(transactionItemMongoProjection).lean();
  if(transaction == null) throw new Error(`transaction is not found. transactionId=${transactionId}`);
  webpush.sendMessageForDeclineTransaction(transaction);
  return transaction;
}

export async function cancelTransaction({
  issuerUserId,
  transactionId,
}:{
  issuerUserId: string,
  transactionId: string,
}){

  const transaction = await TransactionModel.findOneAndDelete(
    { issuerUserId, transactionId, acceptedAt: null }
  ).select(transactionItemMongoProjection).lean();
  if(transaction == null) throw new Error(`transaction is not found. transactionId=${transactionId}`);
  webpush.sendMessageForCancelTransaction(transaction);
  return transaction;
}