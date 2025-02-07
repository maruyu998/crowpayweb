import { InvalidParamError, UnexpectedError } from "maruyu-webcommons/node/errors";
import { FriendClientType, friendListMongoProjection } from "../../mtypes/FriendType";
import { FriendModel } from "../mongoose/FriendModel";
import { UserModel } from "../mongoose/UserModel";
import * as webpush from "./utils/webpush";
import { UserType } from "../../mtypes/UserType";

export async function getFriendList({
  userId
}:{
  userId: string
}){
  const friendList = await FriendModel.find({
                        $or: [ { userId }, { friendUserId: userId } ]
                      }, friendListMongoProjection
                    ).sort({ lastDealedAt:-1 }).lean();
  const userIdList = Array.from(new Set([...friendList.map(f=>f.userId), ...friendList.map(f=>f.friendUserId)]));
  const userList = await Promise.all(userIdList.map(async userId=>UserModel.findOne({userId}).lean()));
  const userDict:Record<string,UserType> = {}
  for(let i=0; i<userIdList.length; i++) {
    const user = userList[i];
    if(user == null) throw new UnexpectedError("user is null");
    userDict[userIdList[i]] = user;
  }
  const newFriendList = friendList.map(friend=>{
    const friendUserId = friend.userId == userId ? friend.friendUserId : friend.userId;
    const status = friend.accepted ? "friend"
                  : friend.userId == userId ? "requesting" : "requested";
    const inviterUserId = userDict[friendUserId].inviterUserId;
    const inviterUser = inviterUserId ? userDict[inviterUserId] : null;
    return {
      friendUserId,
      friendUserName: userDict[friendUserId].userName,
      // userDictには友人関連しか入っていないので，全く関係ないところからの招待は表示しないようにする．
      inviterUserId: inviterUser ? inviterUser.userId : undefined, 
      inviterUserName: inviterUser ? inviterUser.userName : undefined,
      status, 
      amount: status == "friend" ? userDict[friendUserId].amount : null,
      walletIdList: status == "friend" ? userDict[friendUserId].walletIdList : null,
      dealCount: friend.dealCount,
      lastDealedAt: friend.lastDealedAt,
    } as FriendClientType;
  })
  return newFriendList;
}

export async function requestFriend({
  userId,
  friendUserName
}:{
  userId: string,
  friendUserName: string
}){
  const friendUser = await UserModel.findOne({userName:friendUserName.toLowerCase()});
  if(friendUser == null) throw new InvalidParamError(`${friendUserName} is not exist.`);
  const friendUserId = friendUser.userId;

  const friendOld = await FriendModel.findOne({
    $or: [ {userId, friendUserId}, {userId:friendUserId, friendUserId:userId} ]
  });
  if(friendOld){
    if(friendOld.accepted) throw new InvalidParamError(`${friendUserName} is already friend.`);
    if(friendOld.userId == userId) throw new InvalidParamError(`friend request is already sent.`);
    if(friendOld.friendUserId == userId) throw new InvalidParamError(`friend request is already exist.`);
  }
  const friend = await FriendModel.create({ userId, friendUserId, accepted:false });
  if(friend == null) throw new Error("Friend Creation Error.");
  webpush.sendRequestForAcceptFriend(friend);
  return friend;
}

export async function acceptFriend({
  userId,
  friendUserId
}:{
  userId: string,
  friendUserId: string
}){
  const friend = await FriendModel.findOneAndUpdate(
    { userId:friendUserId, friendUserId:userId, accepted:false },
    { $set: { accepted:true } },
    { upsert:false, new:true }
  );
  if(friend == null) throw new Error("friend request is not found.");
  webpush.sendMessageForAcceptFriend(friend);
  return friend;
}

export async function declineFriend({
  userId,
  friendUserId
}:{
  userId: string,
  friendUserId: string
}){
  const friend = await FriendModel.findOne({ userId:friendUserId, friendUserId:userId, accepted:false });
  if(friend == null) throw new Error("friend request is not found.");
  await friend.deleteOne();
  webpush.sendMessageForDeclineFriend(friend);
  return friend;
}

export async function cancelFriend({
  userId,
  friendUserId
}:{
  userId: string,
  friendUserId: string
}){
  const friend = await FriendModel.findOne({ userId, friendUserId, accepted:false });
  if(friend == null) throw new Error("friend request is not found.");
  await friend.deleteOne();
  webpush.sendMessageForCancelFriend(friend);
  return friend;
}