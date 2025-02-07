import { deletePacket, getPacket, postPacket } from "maruyu-webcommons/commons/utils/fetch";
import { InvitationType } from "../../../mtypes/InvitationType";

export async function getInvitationList():Promise<InvitationType[]>{
  const url = new URL("/api/v1/invitation/list", window.location.href);
  return getPacket(url.toString())
        .then(({title, message, data})=>{
          if (typeof data != "object") throw new Error("data is not object");
          if (!("invitationList" in (data as object))) throw new Error("invitationList is not found");
          const invitationList = (data as {invitationList: InvitationType[]}).invitationList;
          return invitationList;
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}

export async function issueInvitation():Promise<void>{
  return postPacket("/api/v1/invitation/item", {})
        .then(({title, message, data})=>{
          // if (typeof data != "object") throw new Error("data is not object");
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}

export async function removeInvitation({
  invitationId
}:{
  invitationId: string
}):Promise<void>{
  return deletePacket("/api/v1/invitation/item", { invitationId })
        .then(({title, message, data})=>{
          // if (typeof data != "object") throw new Error("data is not object");
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}