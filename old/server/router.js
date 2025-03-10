import express from 'express';
import transaction from './transaction.js';
import user from './user.js';
import webpush from './webpush.js';
import auth from './auth.js';
import notification from './notification.js'

const loginRequired = auth.loginRequired;
const router = express.Router();
// const { absolutePath } = require("swagger-ui-dist");
// router.use('/swagger.yaml', express.static(path.join(__dirname, "./swagger.yaml")));
// router.use(express.static(absolutePath()));

router.get('/webpush', loginRequired, webpush.getPublicKey)
router.post('/webpush', loginRequired, webpush.addSubscription)

router.get('/getUsername', auth.getUsername)
router.get('/getUserInfo', auth.getUserInfo)
router.post('/signin', auth.signin)
router.get('/signout', auth.signout)
router.post('/signup', auth.signup)

router.get('/getTransactions', loginRequired, transaction.getTransactions)
router.post('/addTransaction', loginRequired, transaction.addTransaction)
router.post('/acceptTransaction', loginRequired, transaction.acceptTransaction)
router.post('/declineTransaction', loginRequired, transaction.declineTransaction)
router.post('/cancelTransaction', loginRequired, transaction.cancelTransaction)

router.get('/getUserSummary', loginRequired, user.getSummary)
router.get('/getAllUsers', loginRequired, user.getAllUsers)
router.get('/getUserFriends', loginRequired, user.getUserFriends)
router.post('/requestAddFriend', loginRequired, user.requestAddFriend)
router.post('/acceptFriend', loginRequired, user.acceptFriend)
router.post('/declineFriend', loginRequired, user.declineFriend)
router.post('/cancelFriend', loginRequired, user.cancelFriend)
router.get('/getPayableWallets', loginRequired, user.getPayableWallets);
router.post('/setPayableWallets', loginRequired, user.setPayableWallets);
router.get('/issueInvitationCode', loginRequired, user.issueInvitationCode)
router.post('/removeInvitationCode', loginRequired, user.removeInvitationCode)

router.get('/getNotifications', loginRequired, notification.getNotifications)
// router.post('/removeNotification', loginRequired, notification.removeNotification)

export default router;