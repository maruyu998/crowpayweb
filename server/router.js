import express from 'express';
import transaction from './transaction.js';
import user from './user.js';
import webpush from './webpush.js';
import auth from './auth.js';

const loginRequired = auth.loginRequired;
const router = express.Router();
// const { absolutePath } = require("swagger-ui-dist");
// router.use('/swagger.yaml', express.static(path.join(__dirname, "./swagger.yaml")));
// router.use(express.static(absolutePath()));

router.get('/webpush', loginRequired, webpush.getPublicKey)
router.post('/webpush', loginRequired, webpush.addSubscription)

router.get('/getUsername', auth.getUsername)
router.post('/signin', auth.signin)
router.get('/signout', auth.signout)
router.post('/signup', auth.signup)

router.get('/getTransactions', loginRequired, transaction.getTransactions)
router.post('/addTransaction', loginRequired, transaction.addTransaction)
router.post('/acceptTransaction', loginRequired, transaction.acceptTransaction)
router.post('/declineTransaction', loginRequired, transaction.declineTransaction)
router.post('/cancelTransaction', loginRequired, transaction.cancelTransaction)

router.get('/getUserSummary', loginRequired, user.getSummary)
router.get('/getUserFriends', loginRequired, user.getUserFriends)
router.post('/requestAddFriend', loginRequired, user.requestAddFriend)
router.post('/acceptFriend', loginRequired, user.acceptFriend)

export default router;