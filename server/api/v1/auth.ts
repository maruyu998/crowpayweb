import express from "express";
import rateLimit from 'express-rate-limit';
import { requireBodyParams, requireSignin } from "../../utils/middleware";
import { changePassword, signin, signup } from "../../interface/auth";
import { clearUserInfoSession, getUserInfo } from "../../utils/auth";
import { regenerateSession, sendData, sendError, sendMessage } from "maruyu-webcommons/node/express";
import { MINUTE } from "maruyu-webcommons/commons/utils/time";

const apiLimiter = rateLimit({
  windowMs: 30 * MINUTE,
  limit: 5,
  standardHeaders: true, // Rate Limitヘッダーに関する情報を返す
  legacyHeaders: false, // 無効化されたRate Limitヘッダーを削除する
});

const router = express.Router();

// signin
router.post('/', [
  requireBodyParams("userName", "password")
], async function(request:express.Request, response:express.Response){
  const { userName, password } = response.locals.bodies;
  signin({request, userName, password})
    .then(async () => {
      response.locals.currentUserInfo = await getUserInfo(request);
      sendMessage(response, "Signin Successed", "", true);
    })
    .catch(error => {
      console.error(error);
      sendError(response, error);
    });
});

// signup
router.put('/', [
  apiLimiter,
  requireBodyParams("userName", "password", "invitationCode")
], async function(request:express.Request, response:express.Response){
  const { userName, password, invitationCode } = response.locals.bodies;
  signup({request, userName, password, invitationCode})
    .then(({userId}) => {
      sendData(response, "Signup Successed", "", { userId }, true);
    })
    .catch(error => {
      console.error(error);
      sendError(response, error);
    });
});

// signout
router.delete('/', [
  requireSignin
], async function(request:express.Request, response:express.Response){
  await clearUserInfoSession(request);
  await regenerateSession(request);
  sendMessage(response, "Signout Successed", "", false);
});

// change password
router.put("/password", [
  requireSignin,
  requireBodyParams("currentPassword", "newPassword")
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  const { currentPassword, newPassword } = response.locals.bodies;
  changePassword({request, userId, currentPassword, newPassword})
    .then(() => {
      sendMessage(response, "Password Change was Successed", "", true);
    })
    .catch(error => {
      console.error(error);
      sendError(response, error);
    });
});

export default router;