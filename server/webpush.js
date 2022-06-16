import config from 'config';
import webpush from 'web-push';
import mongoose from 'mongoose';
import Notification from './db/notification.js';

webpush.setVapidDetails(
    'mailto:yukimaru@maruyu.work',
    config.webpush_public_key,
    config.webpush_private_key
);

const Subscription = mongoose.model('subscription', 
    new mongoose.Schema({
        username: String,
        endpoint: String,
        subscription: Object
    })
)

async function sendNotification(subscription, object){
    try{
        await webpush.sendNotification(subscription, JSON.stringify(object));
    } catch(e){
        if(e.body == "push subscription has unsubscribed or expired.\n"){
            await Subscription.findOneAndRemove({endpoint: e.endpoint}).exec();
        }else{
            console.error(e)
        }
    }
}

export default class {
    static getPublicKey = (req, res) => {
        res.json({publicKey : config.webpush_public_key});
    }
    static addSubscription = async (req, res) => {
        const username = req.session.username;
        const subscription = req.body.subscription
        if(!await Subscription.findOne({username, endpoint:subscription.endpoint})){
            await Subscription({username, endpoint:subscription.endpoint, subscription}).save();
        }
        res.send('ok');
    }
    
    static sendRequestForAcceptTransaction = async (transaction) => {
        const w = (transaction.accepter == transaction.receiver) ? "支払い" : "請求";
        const who = transaction.accepter;
        const title = `取引承認依頼(${transaction.content})`;
        const body = `${transaction.issuer}より¥ ${transaction.amount}の${w}が届いています．`;
        const object = {
            tag: 'crowpay-issue-transaction', title,  body, 
            actions: [{action:'openTransaction', title:'取引を確認する'}]
        }
        await Notification({username: who, title, message: body}).save();
        const subscriptions = (await Subscription.find({username:who}).exec()).map(s=>s.subscription);
        for(let subscription of subscriptions) sendNotification(subscription, object);
    }
    
    static sendMessageForAcceptTransaction = async (transaction) => {
        const w = (transaction.accepter == transaction.receiver) ? "支払い" : "請求";
        const who = transaction.issuer;
        const title = `取引が承認されました(${transaction.content})`;
        const body = `${transaction.accepter}より¥ ${transaction.amount}の${w}が承認されました．`;
        const object = {
            tag: 'crowpay-accept-transaction', title, body,
            actions: [{action:'openTransaction', title:'取引を承認・確認する'}]
        }
        await Notification({username:who, title, message:body}).save();
        const subscriptions = (await Subscription.find({username:who}).exec()).map(s=>s.subscription);
        for(let subscription of subscriptions) sendNotification(subscription, object);
    }
    
    static sendMessageForDeclineTransaction = async (transaction) => {
        const w = (transaction.accepter == transaction.receiver) ? "支払い" : "請求";
        const who = transaction.issuer;
        const title = `取引が却下されました(${transaction.content})`;
        const body = `${transaction.accepter}より¥ ${transaction.amount}の${w}が却下されました．`;
        const object = {
            tag: 'crowpay-decline-transaction', title, body,
            actions: [{action:'openTransaction', title:'取引を確認する'}]
        }
        await Notification({username:who, title, message:body}).save();
        const subscriptions = (await Subscription.find({username:who}).exec()).map(s=>s.subscription);
        for(let subscription of subscriptions) sendNotification(subscription, object);
    }

    static sendMessageForCancelTransaction = async (transaction) => {
        const w = (transaction.accepter == transaction.receiver) ? "支払い" : "請求";
        const who = transaction.accepter;
        const title = `取引請求が差し戻されました(${transaction.content})`;
        const body = `${transaction.issuer}より¥ ${transaction.amount}の${w}が差し戻されました．`;
        const object = {
            tag: 'crowpay-cancel-transaction', title, body,
            actions: [{action:'openTransaction', title:'取引は消えたので確認できません'}]
        }
        await Notification({username:who, title, message:body}).save();
        const subscriptions = (await Subscription.find({username:who}).exec()).map(s=>s.subscription);
        for(let subscription of subscriptions) sendNotification(subscription, object);
    }
    
    static sendRequestForAcceptFriend = async (friend) => {
        const who = friend.friendname;
        const title = `友人申請(${friend.username})`;
        const body = `${friend.username}より友人申請が届いています`;
        const object = {
            tag: 'crowpay-issue-friend', title, body,
            actions: [{action:'openUser', title:'承認・確認する'}]
        }
        await Notification({username:who, title, message:body}).save();
        const subscriptions = (await Subscription.find({username:who}).exec()).map(s=>s.subscription);
        for(let subscription of subscriptions) sendNotification(subscription, object);
    }
    
    static sendMessageForAcceptFriend = async (friend) => {
        const who = friend.username;
        const title = `友人申請承認(${friend.friendname})`;
        const body = `${friend.friendname}より友人申請が承認されました．`;
        const object = {
            tag: 'crowpay-issue-friend', title, body,
            actions: [{action:'openUser', title:'承認・確認する'}]
        }
        await Notification({username:who, title, message:body}).save();
        const subscriptions = (await Subscription.find({username:who}).exec()).map(s=>s.subscription);
        for(let subscription of subscriptions) sendNotification(subscription, object);
    }

    static sendMessageForDeclineFriend = async (friend) => {
        const who = friend.username;
        const title = `友人申請却下(${friend.friendname})`;
        const body = `${friend.friendname}より友人申請が却下されました．`;
        const object = {
            tag: 'crowpay-cancel-friend', title, body,
            actions: [{action:'openUser', title:'却下は確認できません'}]
        }
        await Notification({username:who, title, message:body}).save();
        const subscriptions = (await Subscription.find({username:who}).exec()).map(s=>s.subscription);
        for(let subscription of subscriptions) sendNotification(subscription, object);
    }

    static sendMessageForCancelFriend = async (friend) => {
        const who = friend.friendname;
        const title = `友人申請キャンセル(${friend.username})`;
        const body = `${friend.username}より友人申請がキャンセルされました．`;
        const object = {
            tag: 'crowpay-cancel-friend', title, body,
            actions: [{action:'openUser', title:'キャンセルは確認できません'}]
        }
        await Notification({username:who, title, message:body}).save();
        const subscriptions = (await Subscription.find({username:who}).exec()).map(s=>s.subscription);
        for(let subscription of subscriptions) sendNotification(subscription, object);
    }

}