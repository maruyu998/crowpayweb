import express, { response } from "express";
import { createHash } from "crypto";
import { UserModel } from "../mongoose/UserModel";
import mconfig from "maruyu-webcommons/node/mconfig";
import { AuthenticationError, UnexpectedError } from "maruyu-webcommons/node/errors";
import { regenerateSession } from "maruyu-webcommons/node/express";
import { setUserInfoSession } from "../utils/auth";
import { InvitationModel } from "../mongoose/InvitationModel";
import { FriendModel } from "../mongoose/FriendModel";

const HASH_SALT = mconfig.get("hashSalt");

function hash(text){
  const sha512 = createHash('sha512');
  sha512.update(text + HASH_SALT);
  return sha512.digest('hex');
}

export async function signin({
  request,
  userName,
  password
}:{
  request: express.Request,
  userName: string,
  password: string
}){
  const passwordHash = hash(password);
  const user = await UserModel.findOne({userName: userName.toLowerCase(), passwordHash}).exec();
  if(user == null) throw new AuthenticationError('username or password is wrong.');

  await regenerateSession(request);
  await setUserInfoSession(request, { userId: user.userId, userName: user.userName });
}

export async function signup({
  request,
  userName,
  password,
  invitationCode,
}:{
  request: express.Request,
  userName: string,
  password: string,
  invitationCode: string,
}){
  if(userName.length > 12) throw new Error("username is too long. (length must be <= 12)");
  if(password.length < 8) throw new Error("password is too short. (length must be >= 8)");
  
  await InvitationModel.deleteMany({expiredAt: {$lt: new Date()}});
  const invitation = await InvitationModel.findOne({invitationCode, expiredAt: {$gte: new Date()}}).exec();
  if(!invitation) throw new AuthenticationError(`invitation is not found.`);

  const existingUser = await UserModel.findOne({userName: userName.toLowerCase()});
  if(existingUser != null) throw new Error(`username [${userName.toLowerCase()}] is already registered.`);
  
  const inviterUserId = invitation.issuerUserId;
  const passwordHash = hash(password);

  const user = await UserModel.create({
    userName: userName.toLowerCase(), 
    passwordHash, 
    inviterUserId, 
    lastEditedAt: new Date(),
  });
  
  await FriendModel.create({userId:inviterUserId, friendUserId:user.userId, accepted:true});
  await InvitationModel.deleteOne({invitationId: invitation.invitationId});

  await regenerateSession(request);
  await setUserInfoSession(request, { userId: user.userId, userName: user.userName });
  return { userId: user.userId };
}

export async function changePassword({
  request,
  userId,
  currentPassword,
  newPassword
}:{
  request: express.Request,
  userId: string,
  currentPassword: string,
  newPassword: string
}){
  const currentPasswordHash = hash(currentPassword);
  const user = await UserModel.findOne({userId, passwordHash:currentPasswordHash}).exec();
  if(user == null) throw new AuthenticationError('password is wrong.');

  const newPasswordHash = hash(newPassword);
  const newUser = await UserModel.findOneAndUpdate(
    { userId, passwordHash: currentPasswordHash },
    { $set: { passwordHash: newPasswordHash, lastEditedAt: new Date() }},
    { new:true, upsert:false }
  );
  if(newUser == null) throw new UnexpectedError("Unexpected Error");
  
  await regenerateSession(request);
  await setUserInfoSession(request, { userId: user.userId, userName: user.userName });
}