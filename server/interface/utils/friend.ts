import { FriendModel } from "../../mongoose/FriendModel";

export async function isFriend(userId1:string, userId2:string):Promise<boolean>{
  const friend = await FriendModel.findOne(
    {
      $or: [
        {userId:userId1, friendUserId:userId2, accepted:true},
        {userId:userId2, friendUserId:userId1, accepted:true},
      ]
    }
  );
  if(friend == null) return false;
  return true;
}