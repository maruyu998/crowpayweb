import Transaction from './db/transaction.js';
import Friend from './db/friend.js';
import User from './db/user.js';
import webpush from './webpush.js';

export default class {
    static getTransactions = async (req, res) => {
        const username = req.session.username;
        const transactions = await Transaction.find({
            $or: [{sender: username}, {receiver: username}]
        }).exec();
        res.json({
            messages: [],
            username: username,
            transactions: transactions
        })
    }
    
    static addTransaction = async (req, res) => {
        const username = req.session.username;
        let { receiver, sender, amount, content, raw_amount, rate, unit } = req.body;
        let accepter;
        if(!Number.isInteger(amount)){
            res.json({
                messages: [{type: 'warning', text: 'amount must be integer.'}]
            })
            return;
        }
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
        if(!receiver && !!sender){
            receiver = username
            accepter = sender
        }else if(!!receiver && !sender){
            sender = username
            accepter = receiver
        }else{
            res.json({
                messages: [{type:'warning', text:'invalid request. receiver or sender is required and another is not required.'}]
            })
            return
        }
        if(username==accepter){
            res.json({
                messages: [{type:'warning', text:'invalid request. accepter is invalid.'}]
            })
            return
        }
        if(amount>1000000){
            res.json({
                messages: [{type:'warning', text:'invalid request. amount is too numerous.'}]
            })
            return
        }
        if(!await Friend.findOne({username, friendname: accepter, accepted: true}).exec()){
            res.json({
                messages: [{type:'warning', text:'invalid request. accepter is invalid.'}]
            })
            return
        }
        const transaction = await Transaction({
            issuer: username,
            issued_at: new Date(),
            accepter, 
            sender, receiver, amount, content, raw_amount, rate, unit, 
            accepted: false
        }).save()
        res.json({
            messages: [{type:'info', text:'transaction issued successfully.'}]
        })
        webpush.sendRequestForAcceptTransaction(transaction);
    }
    
    static acceptTransaction = async (req, res) => {
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
            {username: transaction.receiver},
            {$inc:{ amount: transaction.amount }}
        )
        res.json({
            messages: [{type: 'info', text: 'transcation is accepted successfully.'}]
        })
        webpush.sendMessageForAcceptTransaction(transaction);
    }
    
    static declineTransaction = async (req, res) => {
        const username = req.session.username;
        const transaction_id = req.body.transaction_id;
        const transaction = await Transaction.findOne({accepter: username, _id: transaction_id, accepted_at: null}).exec();
        if(!transaction){
            res.json({
                messages: [{type: 'warning', text: 'transaction is not found.'}]
            })
            return
        }
        await Transaction.findOneAndRemove({_id: transaction_id});
        res.json({
            messages: [{type: 'info', text: 'declined transaction successfully.'}]
        });
        webpush.sendMessageForDeclineTransaction(transaction);
    }

    static cancelTransaction = async (req, res) => {
        const username = req.session.username;
        const transaction_id = req.body.transaction_id;
        const transaction = await Transaction.findOne({issuer: username, _id: transaction_id, accepted_at: null}).exec();
        if(!transaction){
            res.json({
                messages: [{type: 'warning', text: 'transaction is not found.'}]
            })
            return
        }
        await Transaction.findOneAndRemove({_id: transaction_id});
        res.json({
            messages: [{type: 'info', text: 'cancel transaction successfully.'}]
        });
        webpush.sendMessageForCancelTransaction(transaction);
    }
}