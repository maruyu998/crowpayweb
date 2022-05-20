const Transaction = require('./db/transaction');
const Friend = require('./db/friend');
const User = require('./db/user');

module.exports.getTransactions = async (req, res) => {
    const username = req.session.username;
    const transactions = await Transaction.find({
        $or: [{sender: username}, {reciever: username}]
    }).exec();
    res.json({
        messages: [],
        username: username,
        transactions: transactions
    })
}

module.exports.addTransaction = async (req, res) => {
    const username = req.session.username;
    let { reciever, sender, amount, content, raw_amount, rate, unit } = req.body;
    let accepter;
    if(amount <= 0) {
        res.json({
            messages: [{type: 'warning', text: 'amount must be positive.'}]
        })
        return;
    }
    if(!content){
        res.json({
            messages: [{type:'warning', text:'invalid request. content is required.'}]
        })
        return
    }
    if(!reciever && !!sender){
        reciever = username
        accepter = sender
    }else if(!!reciever && !sender){
        sender = username
        accepter = reciever
    }else{
        res.json({
            messages: [{type:'warning', text:'invalid request. reciever or sender is required and another is not required.'}]
        })
        return
    }
    if(!await Friend.findOne({username, friendname: accepter}).exec()){
        res.json({
            messages: [{type:'warning', text:'invalid request. accepter is invalid.'}]
        })
        return
    }
    await Transaction({
        issuer: username,
        issued_at: new Date(),
        accepter, 
        sender, reciever, amount, content, raw_amount, rate, unit, 
        accepted: false
    }).save()
    res.json({
        messages: [{type:'info', text:'transaction issued successfully.'}]
    })
}

module.exports.acceptTransaction = async (req, res) => {
    const username = req.session.username;
    const transaction_id = req.body.transaction_id
    const transaction = await Transaction.findOne({
        accepter: username, _id: transaction_id, accepted_at: null
    }).exec();
    if(!transaction){
        res.json({
            messages: [{type: 'warning', text: 'transaction is not found.'}]
        })
        return
    }
    await Transaction.findOneAndUpdate(
        {_id: transaction_id}, 
        {accepted: true, accepted_at: new Date()}
    ).exec();
    await User.findOneAndUpdate(
        {username: transaction.sender},
        {$inc:{ amount: transaction.amount * -1 }}
    )
    await User.findOneAndUpdate(
        {username: transaction.reciever},
        {$inc:{ amount: transaction.amount }}
    )

    res.json({
        messages: [{type: 'info', text: 'transcation is accepted successfully.'}]
    })
}