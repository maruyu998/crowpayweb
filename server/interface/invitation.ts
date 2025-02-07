import { invitationListMongoProjection, InvitationType } from "../../mtypes/InvitationType";
import { InvitationModel } from "../mongoose/InvitationModel";

export async function getInvitationList({
  userId,
}:{
  userId: string,
}):Promise<InvitationType[]>{

  const invitationList = await InvitationModel.find(
    {issuerUserId:userId}, invitationListMongoProjection
  ).sort({issuedAt:-1}).lean();
  return invitationList;
}

export async function issueInvitation({
  userId
}:{
  userId: string
}){
  await InvitationModel.deleteMany({issuerUserId:userId, expiredAt:{$lt:new Date()}});
  const invitations = await InvitationModel.find({ issuerUserId: userId });
  if(invitations.length > 3) throw new Error('too many invitations.');

  const invitation = await InvitationModel.create({ issuerUserId: userId });
  if(invitation == null) throw new Error("[issueInvitation] Issue Invitation is failed.");
  return invitation.toJSON();
}

export async function removeInvitation({
  userId,
  invitationId
}:{
  userId: string,
  invitationId: string,
}){
  const invitation = await InvitationModel.findOneAndDelete(
    { issuerUserId: userId, invitationId }
  ).lean();
  if(invitation == null) throw new Error(`invitation is not found. invitationId=${invitationId}`);
  return invitation;
}