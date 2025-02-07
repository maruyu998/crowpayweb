import express from 'express';
import { requireSignin } from '../../utils/middleware';

import authRouter from "./auth";
import userRouter from "./user";
import friendRouter from "./friend";
import walletRouter from "./wallet";
import transactionRouter from "./transaction";
import notificationRouter from "./notification";
import invitationRouter from "./invitation";

// import convertRouter from "./convert";

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/friend', friendRouter);
router.use('/wallet', walletRouter);
router.use('/transaction', transactionRouter);
router.use('/notification', notificationRouter);
router.use('/invitation', invitationRouter);

// router.use('/convert', convertRouter); // for temp

export default router;