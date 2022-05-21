const config = require('config');
const webpush = require('web-push');

webpush.setVapidDetails(
    'mailto:yukimaru@maruyu.work',
    config.webpush_public_key,
    config.webpush_private_key
);

const subscriptions = {};

module.exports.getPublicKey = (req, res) => {
    res.json({publicKey : config.webpush_public_key});
}
module.exports.addSubscription = (req, res) => {
    const username = req.session.username;
    if(subscriptions[username] === undefined) subscriptions[username] = {}
    const subscription = req.body.subscription
    subscriptions[username][subscription.endpoint] = subscription
    console.log(subscriptions)
    res.send('ok')
}

module.exports.sendRequestForAcceptTransaction = (transaction) => {
    const w = (transaction.accepter == transaction.receiver) ? "支払い" : "請求";
    const object = {
        title: `取引承認依頼(${transaction.content})`,
        body: `${transaction.issuer}より¥ ${transaction.amount}の${w}が届いています．`,
        actions: [{action:'openTransaction', title:'取引を確認する'}]
    }
    for(let subscription of Object.values(subscriptions[transaction.accepter] || {})){
        try{
            webpush.sendNotification(subscription, JSON.stringify(object));
        } catch(e){console.error(e)}
    }
}

module.exports.sendRequestForAcceptTransaction = (transaction) => {
    const w = (transaction.accepter == transaction.receiver) ? "支払い" : "請求";
    const object = {
        tag: 'crowpay-issue-transaction',
        title: `取引承認依頼(${transaction.content})`,
        body: `${transaction.issuer}より¥ ${transaction.amount}の${w}が届いています．`,
        actions: [{action:'openTransaction', title:'取引を確認する'}]
    }
    for(let subscription of Object.values(subscriptions[transaction.accepter] || {})){
        try{
            webpush.sendNotification(subscription, JSON.stringify(object));
        } catch(e){console.error(e)}
    }
}

module.exports.sendMessageForAcceptTransaction = (transaction) => {
    const w = (transaction.accepter == transaction.receiver) ? "支払い" : "請求";
    const object = {
        tag: 'crowpay-accept-transaction',
        title: `取引が承認されました(${transaction.content})`,
        body: `${transaction.accepter}より¥ ${transaction.amount}の${w}が承認されました．`,
        actions: [{action:'openTransaction', title:'取引を承認・確認する'}]
    }
    for(let subscription of Object.values(subscriptions[transaction.issuer] || {})){
        try{
            webpush.sendNotification(subscription, JSON.stringify(object));
        } catch(e){console.error(e)}
    }
}

module.exports.sendMessageForDeclineTransaction = (transaction) => {
    const w = (transaction.accepter == transaction.receiver) ? "支払い" : "請求";
    const object = {
        tag: 'crowpay-decline-transaction',
        title: `取引が却下されました(${transaction.content})`,
        body: `${transaction.accepter}より¥ ${transaction.amount}の${w}が却下されました．`,
        actions: [{action:'openTransaction', title:'取引を確認する'}]
    }
    for(let subscription of Object.values(subscriptions[transaction.issuer] || {})){
        try{
            webpush.sendNotification(subscription, JSON.stringify(object));
        } catch(e){console.error(e)}
    }
}

module.exports.sendRequestForAcceptFriend = (friend) => {
    const object = {
        tag: 'crowpay-issue-friend',
        title: `友人申請(${friend.username})`,
        body: `${friend.username}より友人申請が届いています`,
        actions: [{action:'openUser', title:'承認・確認する'}]
    }
    for(let subscription of Object.values(subscriptions[friend.friendname] || {})){
        try{
            webpush.sendNotification(subscription, JSON.stringify(object));
        } catch(e){console.error(e)}
    }
}

module.exports.sendMessageForAcceptFriend = (friend) => {
    const object = {
        tag: 'crowpay-issue-friend',
        title: `友人申請承認(${friend.friendname})`,
        body: `${friend.friendname}より友人申請が承認されました．`,
        actions: [{action:'openUser', title:'承認・確認する'}]
    }
    for(let subscription of Object.values(subscriptions[friend.username] || {})){
        try{
            webpush.sendNotification(subscription, JSON.stringify(object));
        } catch(e){console.error(e)}
    }
}