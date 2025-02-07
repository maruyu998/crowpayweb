import express from "express";
import rateLimit from 'express-rate-limit';
import { requireBodyParams, requireQueryParams, requireSignin } from "../../utils/middleware";
import { sendData, sendError, sendMessage } from "maruyu-webcommons/node/express";
import { AuthenticationError, InvalidParamError } from "maruyu-webcommons/node/errors";
import { acceptTransaction, cancelTransaction, declineTransaction, getTransactionList, issueTransaction } from "../../interface/transaction";
import { MINUTE } from "maruyu-webcommons/commons/utils/time";

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
  getTransactionList({ userId })
    .then(transactionList => {
      sendData(response, "GetTransactionList", "", { transactionList }, false);
    })
    .catch(error => {
      console.error(error);
      sendError(response, error);
    });
});

router.post("/issue", [
  requireSignin,
  apiLimiter,
  requireBodyParams("receiverUserId", "senderUserId", "amount", "content")
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  let { receiverUserId, senderUserId, amount, content } = response.locals.bodies;
  if(typeof receiverUserId == "string" && receiverUserId.length == 0){
    return sendError(response, new InvalidParamError('invalid request. receiverUserId is required.'));
  }
  if(typeof senderUserId == "string" && senderUserId.length == 0){
    return sendError(response, new InvalidParamError('invalid request. senderUserId is required.'));
  }
  if(Number.isNaN(Number(amount))){
    return sendError(response, new InvalidParamError('invalid request. amount is required.'));
  }
  if(typeof content == "string" && content.length == 0){
    return sendError(response, new InvalidParamError('invalid request. content is required.'));
  }
  if(receiverUserId != userId && senderUserId != userId){
    return sendError(response, new InvalidParamError(`invalid request. receiverUserId or senderUserId must be you.`));
  }
  if(receiverUserId == senderUserId){
    return sendError(response, new InvalidParamError(`invalid request. receiverUserId and senderUserId must be another account.`));
  }
  const issuerUserId = userId;
  const accepterUserId = (receiverUserId == userId) ? senderUserId : receiverUserId;

  issueTransaction({ issuerUserId, accepterUserId, receiverUserId, senderUserId, amount, content })
    .then(transaction => {
      sendMessage(response, "IssuedTransaction", `${transaction.content}(${transaction.amount})`, true);
      // sendData(response, "IssuedTransaction", "", { transaction }, true);
    })
    .catch(error => {
      console.error(error);
      sendError(response, error);
    });
});

router.put("/accept", [
  requireSignin,
  requireBodyParams("transactionId")
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  const { transactionId } = response.locals.bodies;
  acceptTransaction({ accepterUserId:userId, transactionId })
    .then(transaction => {
      sendMessage(response, "AcceptedTransaction", `${transaction.content}(${transaction.amount})`, true);
      // sendData(response, "AcceptedTransaction", "", { transaction }, false);
    })
    .catch(error => {
      console.error(error);
      sendError(response, error);
    });
});

router.delete("/decline", [
  requireSignin,
  requireBodyParams("transactionId")
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  const { transactionId } = response.locals.bodies;
  declineTransaction({ accepterUserId:userId, transactionId })
  .then(transaction => {
    sendMessage(response, "DeclineTransaction", `${transaction.content}(${transaction.amount})`, true);
    // sendData(response, "DeclineTransaction", "", { transaction }, false);
  })
  .catch(error => {
    console.error(error);
    sendError(response, error);
  });
});

router.delete("/cancel", [
  requireSignin,
  requireBodyParams("transactionId")
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  const { transactionId } = response.locals.bodies;
  cancelTransaction({ issuerUserId:userId, transactionId })
  .then(transaction => {
    sendMessage(response, "CancelTransaction", `${transaction.content}(${transaction.amount})`, true);
    // sendData(response, "CancelTransaction", "", { transaction }, false);
  })
  .catch(error => {
    console.error(error);
    sendError(response, error);
  });
});

export default router;