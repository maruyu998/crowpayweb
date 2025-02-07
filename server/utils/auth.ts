import mconfig from "maruyu-webcommons/node/mconfig";
import express from "express";
import { saveSession, regenerateSession, sendError } from "maruyu-webcommons/node//express";
import { AuthenticationError, InvalidParamError, PermissionError } from "maruyu-webcommons/node//errors";

export type UserInfoType = {
  userId: string, 
  userName: string,
};
export type SessionType = { 
  userInfo?: UserInfoType
};

// sessions
function getSession(request:express.Request):SessionType{
  const { userInfo } = request.session.maruyuOAuth || {};
  return { userInfo };
}
export async function setUserInfoSession(request:express.Request, userInfo:UserInfoType){
  if(request.session.maruyuOAuth === undefined) {
    request.session.maruyuOAuth = {};
  }
  request.session.maruyuOAuth.userInfo = userInfo;
  await saveSession(request);
}
export async function clearUserInfoSession(request:express.Request){
  if(request.session.maruyuOAuth === undefined) {
    request.session.maruyuOAuth = {};
  }else{
    request.session.maruyuOAuth.userInfo = undefined;
  }
  await saveSession(request);
}

// userinfo
export async function getUserInfo(request:express.Request):Promise<UserInfoType|null>{
  const { userInfo } = getSession(request);
  if(userInfo != null) return userInfo;
  return null;
}