import express from "express";
import { requireBodyParams, requireQueryParams, requireSignin } from "../../utils/middleware";
import { sendData, sendError } from "maruyu-webcommons/node/express";
import { AuthenticationError, InvalidParamError } from "maruyu-webcommons/node/errors";
import { acceptTransaction, cancelTransaction, declineTransaction, getTransactionList, issueTransaction } from "../../interface/transaction";
import { getWalletList } from "../../interface/wallet";

const router = express.Router();

router.get('/list', [
  requireSignin
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  getWalletList()
    .then(walletList => {
      sendData(response, "GetWalletList", "", { walletList }, false);
    })
    .catch(error => {
      console.error(error);
      sendError(response, error);
    });
});

export default router;