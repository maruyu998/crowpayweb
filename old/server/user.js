import User from './db/user.js';
import Friend from './db/friend.js';
import Wallet from './db/wallet.js';
import webpush from './webpush.js';
import { v4 as uuidv4 } from 'uuid';
import Invitation from './db/invitation.js';
import { generateRandomNumberString } from './utils.js';

export default class {
    static getSummary = async (req, res) => {
        const username = req.session.username;
        const user = await User.findOne({username}).exec();
        if(!user){
            res.json({
                messages: [{type: 'warning', text: 'user do not exist.'}],
                redirect: '/signin'
            })
            return
        }
        res.json({
            messages: [],
            username: username,
            amount: user.amount,
            recent_transactions: []
        })
    }

    static getAllUsers = async (req, res) => {
        const username = req.session.username;
        const friend_names = [username, ...(await Friend.find({username, accepted:true}).exec()).map(f=>f.friendname)];
        const users_raw = await User.find().exec()
        const user_id_dict = {}
        for(let user of users_raw) user_id_dict[user.username] = uuidv4().split('-')[0]
        const wallets = await Wallet.find().exec()
        const wallet_id_dict = {}
        for(let wallet of wallets) wallet_id_dict[wallet._id] = wallet.name

        const users = users_raw.map(user=>({
            username: friend_names.indexOf(user.username)<0 ? user_id_dict[user.username] : user.username,
            amount: user.amount,
            wallets: user.wallets.map(w=>wallet_id_dict[w._id])
        }))
        const friends = (await Friend.find({accepted:true}).exec()).map(f=>({
            username: friend_names.indexOf(f.username)<0 ? user_id_dict[f.username] : f.username,
            friendname: friend_names.indexOf(f.friendname)<0 ? user_id_dict[f.friendname] : f.friendname
        }))
        res.json({
            messages: [],
            username,
            all_users_info: users,
            all_friends_info: friends,
        })
    }
    
    static getUserFriends = async (req, res) => {
        const username = req.session.username;
        const friends = await Promise.all((await Friend.find({username}).exec()).map(async f=>{
            if(!f.accepted) return { username: f.friendname, accepted: false, amount: null, invitedby: null };
            
            const user = await User.findOne({username: f.friendname}).exec();
            // const _friends = await Friend.find({username:f.friendname, accepted:true}).exec();
            // let friendsamount = user.amount;
            // for(let f of _friends){
            //     friendsamount += (await User.findOne({username: f.friendname})).amount;
            // }
            return { username: f.friendname, accepted: f.accepted, amount: user.amount, invitedby: user.invitedby }
        }));
        const requested_friends = (await Friend.find({friendname: username, accepted: false}).exec()).map(f => (
            { username: f.username, accepted: false, amount: null, invitedby: f.invitedby }
        ));
        res.json({ messages: [], username, friends, requested_friends })
    }
    
    static requestAddFriend = async (req, res) => {
        const username = req.session.username.toLowerCase();
        const friendname = req.body.friendname.toLowerCase();
        if(!friendname || username==friendname){
            return res.json({ messages: [{type:'warning', text: 'invalid request.'}] });
        }
        if(!await User.findOne({username: friendname}).exec()){
            return res.json({ messages: [{type:'warning', text: 'friend is not exist.'}] });
        }
        // お互いにリクエストを送ることは可能．追加条件はacceptした場合のみの設計
        if(await Friend.findOne({username, friendname}).exec()){
            return res.json({ messages: [{type:'warning', text: 'already registered.'}] });
        }
        const friend = await Friend({username, friendname, accepted:false}).save()
        res.json({ messages: [{type: 'info', text: 'requested successfully.'}] })
        webpush.sendRequestForAcceptFriend(friend);
    }
    
    static acceptFriend = async (req, res) => {
        const username = req.session.username.toLowerCase();
        const friendname = req.body.friendname.toLowerCase();
        const friend = await Friend.findOne({username: friendname, friendname: username}).exec();
        if(!friend){
            return res.json({ messages: [{type:'warning', text: 'invalid acception.'}] });
        }
        await Friend.findOneAndUpdate(
            {username: friendname, friendname: username},
            {$set: {accepted: true}}
        )
        await Friend.findOneAndUpdate(
            {username, friendname},
            {$set: {accepted: true}},
            {upsert: true}
        )
        res.json({
            messages: [{type: 'info', text: 'accepted successfully.'}]
        })
        webpush.sendMessageForAcceptFriend(friend);
    }

    static declineFriend = async (req, res) => {
        const username = req.session.username.toLowerCase();
        const friendname = req.body.friendname.toLowerCase();
        const friend = await Friend.findOne({username: friendname, friendname: username, accepted: false}).exec();
        if(!friend){
            res.json({
                messages: [{type:'warning', text: 'friend is not found.'}]
            })
            return
        }
        await Friend.findOneAndRemove({username: friendname, friendname: username, accepted: false})
        res.json({
            messages: [{type: 'info', text: 'declined successfully.'}]
        })
        webpush.sendMessageForDeclineFriend(friend);
    }

    static cancelFriend = async (req, res) => {
        const username = req.session.username.toLowerCase();
        const friendname = req.body.friendname.toLowerCase();
        const friend = await Friend.findOne({username, friendname}).exec();
        if(!friend){
            return res.json({ messages: [{type:'warning', text: 'friend is not found.'}] })
        }
        await Friend.findOneAndRemove({username, friendname})
        res.json({ messages: [{type: 'info', text: 'canceled successfully.'}] })
        webpush.sendMessageForCancelFriend(friend);
    }

    static getPayableWallets = async (req, res) => {
        const username = req.session.username.toLowerCase();
        const selected_payable_wallet_ids = await User.findOne({username}).exec().then(user=>Array.from(new Set(user.wallets.map(w=>w._id))))
        const payable_wallets = await Wallet.find().exec();
        res.json({
            selected_payable_wallet_ids,
            payable_wallets
        })
    }

    static setPayableWallets = async (req, res) => {
        const username = req.session.username.toLowerCase();
        const selected_payable_wallet_ids = Array.from(new Set(req.body.selected_payable_wallet_ids));
        const wallets = [];
        for(let wid of selected_payable_wallet_ids){
            const wallet = await Wallet.findById(wid).exec();
            if(!wallet) {
                res.json({
                    messages: [{type: 'warning', text: `could not find wallet id ${wallet}`}]
                })
                return
            }
            wallets.push(wallet);
        }
        await User.findOneAndUpdate({username}, {wallets}).exec()
        res.json({
            messages: [{type: 'info', text: `wallet ids are updated successfully.`}]
        })
    }

    static issueInvitationCode = async (req, res) => {
        const username = req.session.username.toLowerCase();
        await Invitation.deleteMany({issuer:username, expirationdate:{$lt:new Date()}}).exec()
        const invitations = await Invitation.find({issuer:username}).exec()
        if(invitations.length > 3){
            res.json({
                messages: [{type: 'danger', text: 'too many invitations.'}]
            })
            return
        }
        const code = generateRandomNumberString(6)
        const expirationdate = new Date((new Date()).getTime() + 30 * 60 * 1000)
        await Invitation({issuer:username, code, expirationdate}).save()
        res.json({
            messages: [{type: "info", text: 'invitation code is issued successfully.'}]
        })
    }

    static removeInvitationCode = async (req, res) => {
        const username = req.session.username.toLowerCase();
        const invitationid = req.body.invitationid;
        await Invitation.findOneAndDelete({invitedby:username, _id: invitationid}).exec();
        res.json({
            messages: [{type: 'info', text: 'invitation code is removed successfully.'}]
        })
    }
}