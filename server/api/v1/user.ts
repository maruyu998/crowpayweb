import express from "express";
import { requireBodyParams, requireSignin } from "../../utils/middleware";
import { sendData, sendError, sendMessage } from "maruyu-webcommons/node/express";
import { getUserGraph, getUserInfo, setWallet } from "../../interface/user";

const router = express.Router();

router.get("/summary", [
  requireSignin
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  getUserInfo({ userId })
    .then(user=>{
      sendData(response, "userData", "", { user }, false);
    })
    .catch(error=>{
      console.error(error);
      sendError(response, error);
    })
});


router.get('/graph', [
  requireSignin
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  getUserGraph({ userId })
    .then(({graphUsers, graphFriends})=>{
      sendData(response, "userData", "", { graphUsers, graphFriends }, false);
    })
    .catch(error=>{
      console.error(error);
      sendError(response, error);
    })
});

router.put('/wallet', [
  requireSignin,
  requireBodyParams("walletIdList")
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  const { walletIdList } = response.locals.bodies;
  setWallet({ userId, walletIdList })
    .then(()=>{
      sendMessage(response, "setWallet", "", false);
    })
    .catch(error=>{
      console.error(error);
      sendError(response, error);
    })
});

export default router;