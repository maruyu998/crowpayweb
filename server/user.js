import User from './db/user.js';
import Friend from './db/friend.js';
import webpush from './webpush.js';

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
    
    static getUserFriends = async (req, res) => {
        const username = req.session.username;
        const friends = await Promise.all((await Friend.find({username}).exec()).map(async f=>{
            if(!f.accepted) return { username: f.friendname, accepted: false, amount: null, friendsamount:null };
            
            const user = await User.findOne({username: f.friendname}).exec();
            const _friends = await Friend.find({username:f.friendname, accepted:true}).exec();
            let friendsamount = user.amount;
            for(let f of _friends){
                friendsamount += (await User.findOne({username: f.friendname})).amount;
            }
            return { username: f.friendname, accepted: f.accepted, amount: user.amount, friendsamount }
        }));
        const requested_friends = (await Friend.find({friendname: username, accepted: false}).exec()).map(f => (
            { username: f.username, accepted: false, amount: null }
        ));
        res.json({ messages: [], username, friends, requested_friends })
    }
    
    static requestAddFriend = async (req, res) => {
        const username = req.session.username;
        const friendname = req.body.friendname;
        if(!friendname || username.toLowerCase()==friendname.toLowerCase()){
            res.json({
                messages: [{type:'warning', text: 'invalid request.'}]
            })        
            return
        }
        if(!await User.findOne({username: friendname}).exec()){
            res.json({
                messages: [{type:'warning', text: 'friend is not exist.'}]
            })        
            return
        }
        // お互いにリクエストを送ることは可能．追加条件はacceptした場合のみの設計
        if(await Friend.findOne({username, friendname}).exec()){
            res.json({
                messages: [{type:'warning', text: 'already registered.'}]
            })        
            return
        }
        const friend = await Friend({username, friendname, accepted:false}).save()
        res.json({
            messages: [{type: 'info', text: 'requested successfully.'}]
        })
        webpush.sendRequestForAcceptFriend(friend);
    }
    
    static acceptFriend = async (req, res) => {
        const username = req.session.username;
        const friendname = req.body.friendname;
        const friend = await Friend.findOne({username: friendname, friendname: username}).exec();
        if(!friend){
            res.json({
                messages: [{type:'warning', text: 'invalid acception.'}]
            })
            return
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
        const username = req.session.username;
        const friendname = req.body.friendname;
        const friend = await Friend.findOne({username: friendname, friendname: username}).exec();
        if(!friend){
            res.json({
                messages: [{type:'warning', text: 'friend is not found.'}]
            })
            return
        }
        await Friend.findOneAndRemove({username: friendname, friendname: username})
        res.json({
            messages: [{type: 'info', text: 'declined successfully.'}]
        })
        webpush.sendMessageForDeclineFriend(friend);
    }

    static cancelFriend = async (req, res) => {
        const username = req.session.username;
        const friendname = req.body.friendname;
        const friend = await Friend.findOne({username, friendname}).exec();
        if(!friend){
            res.json({
                messages: [{type:'warning', text: 'friend is not found.'}]
            })
            return
        }
        await Friend.findOneAndRemove({username, friendname})
        res.json({
            messages: [{type: 'info', text: 'canceled successfully.'}]
        })
        webpush.sendMessageForCancelFriend(friend);
    }
}