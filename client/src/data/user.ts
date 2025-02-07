import { getPacket, putPacket } from "maruyu-webcommons/commons/utils/fetch";
import { UserClientType, UserGraphType } from "../../../mtypes/UserType";
import { FriendGraphType } from "../../../mtypes/FriendType";

export async function getUser():Promise<UserClientType>{
  const url = new URL("/api/v1/user/summary", window.location.href);
  return getPacket(url.toString())
        .then(({title, message, data})=>{
          if (typeof data != "object") throw new Error("data is not object");
          if (!("user" in (data as object))) throw new Error("user is not found");
          const user = (data as {user: UserClientType}).user;
          return user;
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}

export async function getGraph():Promise<{graphUsers:UserGraphType[],graphFriends:FriendGraphType[]}>{
  const url = new URL("/api/v1/user/graph", window.location.href);
  return getPacket(url.toString())
        .then(({title, message, data})=>{
          if (typeof data != "object") throw new Error("data is not object");
          if (!("graphUsers" in (data as object))) throw new Error("graphUsers is not found");
          if (!("graphFriends" in (data as object))) throw new Error("graphFriends is not found");
          const { graphUsers, graphFriends } = (data as {graphUsers: UserGraphType[], graphFriends: FriendGraphType[]});
          return { graphUsers, graphFriends };
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}

export async function setAvailableWallet({
  walletIdList
}:{
  walletIdList: string[]
}):Promise<void>{
  return putPacket("/api/v1/user/wallet", { walletIdList })
        .then(({title, message, data})=>{
          // if (typeof data != "object") throw new Error("data is not object");
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}