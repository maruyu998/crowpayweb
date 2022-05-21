const User = require('./db/user');
const Friend = require('./db/friend');
const webpush = require('./webpush');

module.exports.getSummary = async (req, res) => {
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

module.exports.getUserFriends = async (req, res) => {
    const username = req.session.username;
    const amount_dict = {};
    const friends = await Promise.all((await Friend.find({username}).exec()).map(async (f) => {
        if(!f.accepted) return { username: f.friendname, accepted: f.accepted, amount: null, friendsamount:null }
        const user = await User.findOne({username: f.friendname}).exec();
        amount_dict[user.username] = user.amount;
        const _friends = await Friend.find({username, accepted:true}).exec();
        let friendsamount = 0;
        for(let f of _friends){
            let user_amount = 0;
            if(amount_dict[f.friendname] === undefined){
                user_amount = (await User.findOne({username: f.friendname})).amount;
                amount_dict[f.friendname] = user_amount
            } else {
                user_amount = amount_dict[f.friendname]
            }
            friendsamount += user_amount
        }
        return { username: f.friendname, accepted: f.accepted, amount: user.amount, friendsamount }
    }));
    const requested_friends = (await Friend.find({friendname: username, accepted: false}).exec()).map(f => (
        { username: f.username, accepted: false, amount: null }
    ));
    res.json({ messages: [], username, friends, requested_friends })
}

module.exports.requestAddFriend = async (req, res) => {
    const username = req.session.username;
    const friendname = req.body.friendname;
    if(username==friendname || !friendname){
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

module.exports.acceptFriend = async (req, res) => {
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