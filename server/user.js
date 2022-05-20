const User = require('./db/user');
const Friend = require('./db/friend');

module.exports.getSummary = async (req, res) => {
    const username = req.session.username;
    const user = await User.findOne({username}).exec();
    res.json({
        messages: [],
        username: username,
        amount: user.amount,
        recent_transactions: []
    })
}

module.exports.getUserFriends = async (req, res) => {
    const username = req.session.username;
    const friends = await (await Friend.find({username}).exec()).map(f => (
        { username: f.friendname, accepted: f.accepted }
    ));
    const requested_friends = (await Friend.find({friendname: username, accepted: false}).exec()).map(f => (
        { username: f.username, accepted: false }
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
    await Friend({username, friendname, accepted:false}).save()
    res.json({
        messages: [{type: 'info', text: 'requested successfully.'}]
    })
}

module.exports.acceptFriend = async (req, res) => {
    const username = req.session.username;
    const friendname = req.body.friendname;
    if(!await Friend.findOne({username: friendname, friendname: username}).exec()){
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
}