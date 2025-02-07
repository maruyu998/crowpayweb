import webpush from 'web-push';
import { NotificationModel } from '../../mongoose/NotificationModel';
import { getSubscriptioins, sendPush } from 'maruyu-webcommons/node/push';
import { TransactionMongoType } from '../../../mtypes/TransactionType';
import { UserModel } from '../../mongoose/UserModel';
import { UnexpectedError } from 'maruyu-webcommons/node/errors';
import { FriendMongoType } from '../../../mtypes/FriendType';

async function sendNotification({
  targetUserId,
  title,
  message,
  tag,
  actions
}:{
  targetUserId: string,
  title: string,
  message: string,
  tag: string,
  actions: {action:string, title:string}[]
}){
  const object = { title, tag, body:message, actions }
  await NotificationModel.create({userId: targetUserId, title, message});
  const subscriptions = await getSubscriptioins(targetUserId);
  for(let subscription of subscriptions) {
    sendPush(subscription, object)
    .catch(error=>{
      console.error("<<WebPushError>>");
      console.error(error);
    });
  }
}

export async function sendRequestForAcceptTransaction(transaction:TransactionMongoType){
  const w = (transaction.accepterUserId == transaction.receiverUserId) ? "支払い" : "請求";
  const user = await UserModel.findOne({userId:transaction.issuerUserId});
  if(user == null) throw new UnexpectedError("[Notification] user is not found");
  // console.log(transaction);
  await sendNotification({
    targetUserId: transaction.accepterUserId,
    title: `取引承認依頼(${transaction.content})`,
    message: `${user.userName} より ¥${transaction.amount} の${w}が届いています．`,
    tag: 'crowpay-issue-transaction', 
    actions: [{action:'openTransaction', title:'取引を確認する'}]
  });
}

export async function sendMessageForAcceptTransaction(transaction:TransactionMongoType){
  const w = (transaction.accepterUserId == transaction.receiverUserId) ? "支払い" : "請求";
  const user = await UserModel.findOne({userId:transaction.accepterUserId});
  if(user == null) throw new UnexpectedError("[Notification] user is not found");
  // console.log(transaction);
  await sendNotification({
    targetUserId: transaction.issuerUserId,
    title: `取引が承認されました(${transaction.content})`,
    message: `${user.userName} より ¥${transaction.amount} の${w}が承認されました．`,
    tag: 'crowpay-accept-transaction', 
    actions: [{action:'openTransaction', title:'取引を承認・確認する'}]
  });
}

export async function sendMessageForDeclineTransaction(transaction:TransactionMongoType){
  const w = (transaction.accepterUserId == transaction.receiverUserId) ? "支払い" : "請求";
  const user = await UserModel.findOne({userId:transaction.accepterUserId});
  if(user == null) throw new UnexpectedError("[Notification] user is not found");
  // console.log(transaction);
  await sendNotification({
    targetUserId: transaction.issuerUserId,
    title: `取引が却下されました(${transaction.content})`,
    message: `${user.userName} より ¥${transaction.amount} の${w}が却下されました．`,
    tag: 'crowpay-decline-transaction', 
    actions: [{action:'openTransaction', title:'取引を確認する'}]
  });
}

export async function sendMessageForCancelTransaction(transaction:TransactionMongoType){
  const w = (transaction.accepterUserId == transaction.receiverUserId) ? "支払い" : "請求";
  const user = await UserModel.findOne({userId:transaction.issuerUserId});
  if(user == null) throw new UnexpectedError("[Notification] user is not found");
  // console.log(transaction);
  await sendNotification({
    targetUserId: transaction.accepterUserId,
    title: `取引請求が差し戻されました(${transaction.content})`,
    message: `${user.userName} より ¥${transaction.amount} の${w}が差し戻されました．`,
    tag: 'crowpay-cancel-transaction', 
    actions: [{action:'openTransaction', title:'取引はキャンセルされたので確認できません'}]
  });
}

export async function sendRequestForAcceptFriend(friend:FriendMongoType){
  const user = await UserModel.findOne({userId:friend.userId});
  if(user == null) throw new UnexpectedError("[Notification] user is not found");
  await sendNotification({
    targetUserId: friend.friendUserId,
    title: `フレンド申請(${user.userName})`,
    message: `${user.userName} よりフレンド申請が届いています`,
    tag: 'crowpay-issue-friend', 
    actions: [{action:'openUser', title:'承認・確認する'}]
  });
}

export async function sendMessageForAcceptFriend(friend:FriendMongoType){
  const friendUser = await UserModel.findOne({userId:friend.friendUserId});
  if(friendUser == null) throw new UnexpectedError("[Notification] friendUser is not found");
  await sendNotification({
    targetUserId: friend.userId,
    title: `フレンド申請承認(${friendUser.userName})`,
    message: `${friendUser.userName} よりフレンド申請が承認されました．`,
    tag: 'crowpay-accept-friend', 
    actions: [{action:'openUser', title:'確認する'}]
  });
}

export async function sendMessageForDeclineFriend(friend:FriendMongoType){
  const friendUser = await UserModel.findOne({userId:friend.friendUserId});
  if(friendUser == null) throw new UnexpectedError("[Notification] friendUser is not found");
  await sendNotification({
    targetUserId: friend.userId,
    title: `フレンド申請却下(${friendUser.userName})`,
    message: `${friendUser.userName} よりフレンド申請が却下されました．`,
    tag: 'crowpay-decline-friend', 
    actions: [{action:'openUser', title:'却下は確認できません'}]
  });
}

export async function sendMessageForCancelFriend(friend:FriendMongoType){
  const user = await UserModel.findOne({userId:friend.userId});
  if(user == null) throw new UnexpectedError("[Notification] user is not found");
  await sendNotification({
    targetUserId: friend.friendUserId,
    title: `フレンド申請キャンセル(${user.userName})`,
    message: `${user.userId} よりフレンド申請がキャンセルされました．`,
    tag: 'crowpay-cancel-friend', 
    actions: [{action:'openUser', title:'キャンセルは確認できません'}]
  });
}
