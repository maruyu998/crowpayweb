import config from 'config';
import webpush from 'web-push';
import mongoose from 'mongoose';

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
        const object = {
            tag: 'crowpay-issue-transaction',
            title: `取引承認依頼(${transaction.content})`,
            body: `${transaction.issuer}より¥ ${transaction.amount}の${w}が届いています．`,
            actions: [{action:'openTransaction', title:'取引を確認する'}]
        }
        
        const subscriptions = (await Subscription.find({username:transaction.accepter}).exec()).map(s=>s.subscription);
        for(let subscription of subscriptions){
            try{
                webpush.sendNotification(subscription, JSON.stringify(object));
            } catch(e){console.error(e)}
        }
    }
    
    static sendMessageForAcceptTransaction = async (transaction) => {
        const w = (transaction.accepter == transaction.receiver) ? "支払い" : "請求";
        const object = {
            tag: 'crowpay-accept-transaction',
            title: `取引が承認されました(${transaction.content})`,
            body: `${transaction.accepter}より¥ ${transaction.amount}の${w}が承認されました．`,
            actions: [{action:'openTransaction', title:'取引を承認・確認する'}]
        }
        const subscriptions = (await Subscription.find({username:transaction.issuer}).exec()).map(s=>s.subscription);
        for(let subscription of subscriptions){
            try{
                webpush.sendNotification(subscription, JSON.stringify(object));
            } catch(e){console.error(e)}
        }
    }
    
    static sendMessageForDeclineTransaction = async (transaction) => {
        const w = (transaction.accepter == transaction.receiver) ? "支払い" : "請求";
        const object = {
            tag: 'crowpay-decline-transaction',
            title: `取引が却下されました(${transaction.content})`,
            body: `${transaction.accepter}より¥ ${transaction.amount}の${w}が却下されました．`,
            actions: [{action:'openTransaction', title:'取引を確認する'}]
        }
        const subscriptions = (await Subscription.find({username:transaction.issuer}).exec()).map(s=>s.subscription);
        for(let subscription of subscriptions){
            try{
                webpush.sendNotification(subscription, JSON.stringify(object));
            } catch(e){console.error(e)}
        }
    }

    static sendMessageForCancelTransaction = async (transaction) => {
        const w = (transaction.accepter == transaction.receiver) ? "支払い" : "請求";
        const object = {
            tag: 'crowpay-cancel-transaction',
            title: `取引請求が差し戻されました(${transaction.content})`,
            body: `${transaction.issuer}より¥ ${transaction.amount}の${w}が差し戻されました．`,
            actions: [{action:'openTransaction', title:'取引は消えたので確認できません'}]
        }
        const subscriptions = (await Subscription.find({username:transaction.accepter}).exec()).map(s=>s.subscription);
        for(let subscription of subscriptions){
            try{
                webpush.sendNotification(subscription, JSON.stringify(object));
            } catch(e){console.error(e)}
        }
    }
    
    static sendRequestForAcceptFriend = async (friend) => {
        const object = {
            tag: 'crowpay-issue-friend',
            title: `友人申請(${friend.username})`,
            body: `${friend.username}より友人申請が届いています`,
            actions: [{action:'openUser', title:'承認・確認する'}]
        }
        const subscriptions = (await Subscription.find({username:friend.friendname}).exec()).map(s=>s.subscription);
        for(let subscription of subscriptions){
            try{
                webpush.sendNotification(subscription, JSON.stringify(object));
            } catch(e){console.error(e)}
        }
    }
    
    static sendMessageForAcceptFriend = async (friend) => {
        const object = {
            tag: 'crowpay-issue-friend',
            title: `友人申請承認(${friend.friendname})`,
            body: `${friend.friendname}より友人申請が承認されました．`,
            actions: [{action:'openUser', title:'承認・確認する'}]
        }
        const subscriptions = (await Subscription.find({username:friend.username}).exec()).map(s=>s.subscription);
        for(let subscription of subscriptions){
            try{
                webpush.sendNotification(subscription, JSON.stringify(object));
            } catch(e){console.error(e)}
        }
    }
}