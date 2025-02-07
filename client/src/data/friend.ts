import { getPacket, postPacket } from "maruyu-webcommons/commons/utils/fetch";
import { FriendClientType } from "../../../mtypes/FriendType";


export async function getFriendList():Promise<FriendClientType[]>{
  const url = new URL("/api/v1/friend/list", window.location.href);
  return getPacket(url.toString())
        .then(({title, message, data})=>{
          if (typeof data != "object") throw new Error("data is not object");
          if (!("friendList" in (data as object))) throw new Error("friendList is not found");
          const friendList = (data as {friendList: FriendClientType[]}).friendList;
          return friendList;
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}

export async function requestFriend({
  friendUserName
}:{
  friendUserName: string
}){
  return postPacket("/api/v1/friend/request", { friendUserName })
  .then(({title, message, data})=>{
    // if (typeof data != "object") throw new Error("data is not object");
  })
  .catch(error => {
    console.error(error);
    throw error;
  });
}

export async function acceptFriend({
  friendUserId
}:{
  friendUserId: string,
}):Promise<void>{
  return postPacket("/api/v1/friend/accept", { friendUserId })
        .then(({title, message, data})=>{
          // if (typeof data != "object") throw new Error("data is not object");
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}

export async function declineFriend({
  friendUserId
}:{
  friendUserId: string,
}):Promise<void>{
  return postPacket("/api/v1/friend/decline", { friendUserId })
        .then(({title, message, data})=>{
          // if (typeof data != "object") throw new Error("data is not object");
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}

export async function cancelFriend({
  friendUserId
}:{
  friendUserId: string,
}):Promise<void>{
  return postPacket("/api/v1/friend/cancel", { friendUserId })
        .then(({title, message, data})=>{
          // if (typeof data != "object") throw new Error("data is not object");
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}