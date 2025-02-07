import express from "express";
import rateLimit from 'express-rate-limit';
import { requireBodyParams, requireSignin } from "../../utils/middleware";
import { sendData, sendError, sendMessage } from "maruyu-webcommons/node/express";
import { MINUTE } from "maruyu-webcommons/commons/utils/time";
import { getInvitationList, issueInvitation, removeInvitation } from "../../interface/invitation";

const apiLimiter = rateLimit({
  windowMs: 30 * MINUTE,
  limit: 30,
  standardHeaders: true, // Rate Limitヘッダーに関する情報を返す
  legacyHeaders: false, // 無効化されたRate Limitヘッダーを削除する
});

const router = express.Router();

router.get('/list', [
  requireSignin
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  getInvitationList({ userId })
    .then(invitationList => {
      sendData(response, "GetInvitationList", "", { invitationList }, false);
    })
    .catch(error => {
      console.error(error);
      sendError(response, error);
    });
});

router.post("/item", [
  requireSignin,
  apiLimiter,
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  issueInvitation({ userId })
    .then(invitation => {
      sendMessage(response, "IssuedInvitation", "", true);
      // sendData(response, "IssuedInvitation", "", { invitation }, true);
    })
    .catch(error => {
      console.error(error);
      sendError(response, error);
    });
});

router.delete("/item", [
  requireSignin,
  requireBodyParams("invitationId")
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  const { invitationId } = response.locals.bodies;
  removeInvitation({ userId, invitationId })
  .then(invitation => {
    sendMessage(response, "RemoveInvitation", "", false);
  })
  .catch(error => {
    console.error(error);
    sendError(response, error);
  });
});

export default router;