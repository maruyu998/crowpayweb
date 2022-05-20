const path = require('path');
const express = require('express');
const router = express.Router();
const auth = require('./auth');
const loginRequired = auth.loginRequired;
const transaction = require('./transaction');
const user = require('./user');

// const { absolutePath } = require("swagger-ui-dist");
// router.use('/swagger.yaml', express.static(path.join(__dirname, "./swagger.yaml")));
// router.use(express.static(absolutePath()));

router.get('/getUsername', auth.getUsername)
router.post('/signin', auth.signin)
router.get('/signout', auth.signout)
router.post('/signup', auth.signup)

router.get('/getTransactions', loginRequired, transaction.getTransactions)
router.post('/addTransaction', loginRequired, transaction.addTransaction)
router.post('/acceptTransaction', loginRequired, transaction.acceptTransaction)
router.post('/declineTransaction', loginRequired, transaction.declineTransaction)

router.get('/getUserSummary', loginRequired, user.getSummary)
router.get('/getUserFriends', loginRequired, user.getUserFriends)
router.post('/requestAddFriend', loginRequired, user.requestAddFriend)
router.post('/acceptFriend', loginRequired, user.acceptFriend)

module.exports = router