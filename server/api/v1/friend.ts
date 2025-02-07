import express from "express";
import { requireBodyParams, requireSignin } from "../../utils/middleware";
import { sendData, sendError, sendMessage } from "maruyu-webcommons/node/express";
import { acceptFriend, cancelFriend, declineFriend, getFriendList, requestFriend } from "../../interface/friend";

const router = express.Router();

router.get('/list', [
  requireSignin
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  getFriendList({ userId })
    .then(friendList => {
      sendData(response, "GetFriendList", "", { friendList }, false);
    })
    .catch(error => {
      console.error(error);
      sendError(response, error);
    });
});

router.post('/request', [
  requireSignin,
  requireBodyParams("friendUserName")
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  const { friendUserName } = response.locals.bodies;
  requestFriend({ userId, friendUserName })
    .then(friend => {
      sendMessage(response, "RequestFriend", "", false);
      // sendData(response, "RequestFriend", "", { friend }, false);
    })
    .catch(error => {
      console.error(error);
      sendError(response, error);
    });
});

router.post('/accept', [
  requireSignin,
  requireBodyParams("friendUserId")
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  const { friendUserId } = response.locals.bodies;
  acceptFriend({ userId, friendUserId })
    .then(friend => {
      sendMessage(response, "RequestFriend", "", false);
      // sendData(response, "RequestFriend", "", { friend }, false);
    })
    .catch(error => {
      console.error(error);
      sendError(response, error);
    });
});

router.post('/decline', [
  requireSignin,
  requireBodyParams("friendUserId")
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  const { friendUserId } = response.locals.bodies;
  declineFriend({ userId, friendUserId })
    .then(friend => {
      sendMessage(response, "RequestFriend", "", false);
      // sendData(response, "RequestFriend", "", { friend }, false);
    })
    .catch(error => {
      console.error(error);
      sendError(response, error);
    });
});

router.post('/cancel', [
  requireSignin,
  requireBodyParams("friendUserId")
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  const { friendUserId } = response.locals.bodies;
  cancelFriend({ userId, friendUserId })
    .then(friend => {
      sendMessage(response, "RequestFriend", "", false);
      // sendData(response, "RequestFriend", "", { friend }, false);
    })
    .catch(error => {
      console.error(error);
      sendError(response, error);
    });
});

export default router;