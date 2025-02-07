import express from "express";
import { requireBodyParams, requireQueryParams, requireSignin } from "../../utils/middleware";
import { sendData, sendError } from "maruyu-webcommons/node/express";
import { AuthenticationError, InvalidParamError } from "maruyu-webcommons/node/errors";
import { getNotificationList } from "../../interface/notification";

const router = express.Router();

router.get('/list', [
  requireSignin
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  getNotificationList({ userId })
    .then(notificationList => {
      sendData(response, "GetNotificationList", "", { notificationList }, false);
    })
    .catch(error => {
      console.error(error);
      sendError(response, error);
    });
});

export default router;