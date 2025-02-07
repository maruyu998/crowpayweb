import { v4 as uuidv4 } from 'uuid';
import { UserClientType } from "../../mtypes/UserType";
import { FriendModel } from "../mongoose/FriendModel";
import { UserModel } from "../mongoose/UserModel"
import { WalletModel } from "../mongoose/WalletModel";

export async function getUserInfo({
  userId
}:{
  userId: string
}){
  const user = await UserModel.findOne({userId});
  if(user == null) throw new Error("user is not found");
  const { userName, amount, walletIdList, registeredAt, lastEditedAt, inviterUserId } = user;
  const newUser:UserClientType = { userId, userName, amount, walletIdList, registeredAt, lastEditedAt, inviterUserId };
  return newUser;
}

export async function getUserGraph({
  userId
}:{
  userId: string
}){
  const users = await UserModel.find({}, {_id:0,userId:1,userName:1,amount:1,walletIdList:1});
  const wallets = await WalletModel.find({}, {_id:0,walletId:1,walletName:1});
  const friends = await FriendModel.find({accepted:true},{_id:0,userId:1,friendUserId:1,dealCount:1});

  const walletDict = Object.assign({}, ...wallets.map(w=>({[w.walletId]:w.walletName})));

  const currentUsersFriendIds = friends.map(f=>{
    if(f.userId==userId) return f.friendUserId;
    if(f.friendUserId==userId) return f.userId;
    return null;
  }).filter(friendId=>friendId!=null);

  const graphUsers = users.map(user=>({
    userId: user.userId,
    userDisplayName: (user.userId==userId || currentUsersFriendIds.includes(user.userId))
                    ? user.userName : uuidv4().split('-')[0],
    amount: user.amount,
    walletNames: user.walletIdList.map(walletId=>walletDict[walletId])
  }))
  const graphFriends = friends.map(friend=>({
    userId: friend.userId,
    friendUserId: friend.friendUserId,
    dealCount: friend.dealCount,
  }))
  return { graphUsers, graphFriends }
}

export async function setWallet({
  userId,
  walletIdList
}:{
  userId: string
  walletIdList: string[]
}){

  const user = await UserModel.findOneAndUpdate(
    { userId },
    { $set: { walletIdList, lastEditedAt: new Date() }},
    { new:true, upsert:false }
  );
  if(user == null) throw new Error("user is not found");
  return user;
}