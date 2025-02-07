import { deletePacket, getPacket, postPacket, putPacket } from "maruyu-webcommons/commons/utils/fetch";

export async function signin({
  userName, 
  password
}:{
  userName: string,
  password: string
}):Promise<void>{
  const addObject = { userName, password };
  return postPacket("/api/v1/auth", addObject)
        .then(({title, message, data})=>{
          // if (typeof data != "object") throw new Error("data is not object");
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}

export async function signup({
  userName, 
  password,
  invitationCode,
}:{
  userName: string,
  password: string,
  invitationCode: string,
}):Promise<void>{
  const addObject = { userName, password, invitationCode };
  return putPacket("/api/v1/auth", addObject)
        .then(({title, message, data})=>{
          // if (typeof data != "object") throw new Error("data is not object");
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}

export async function signout():Promise<void>{
  return deletePacket("/api/v1/auth", {})
        .then(({title, message, data})=>{
          // if (typeof data != "object") throw new Error("data is not object");
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}

export async function changePassword({
  currentPassword,
  newPassword
}:{
  currentPassword: string,
  newPassword: string
}):Promise<void>{
  return putPacket("/api/v1/auth/password", { currentPassword, newPassword })
        .then(({title, message, data})=>{
          // if (typeof data != "object") throw new Error("data is not object");
        })
        .catch(error => {
          console.error(error);
          throw error;
        });
}