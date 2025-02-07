import Transaction from './db/transaction.js';
import Friend from './db/friend.js';
import User from './db/user.js';
import webpush from './webpush.js';

class UserCount {
    constructor(){
        this.max_count = 30
        this.max_minutes = 30
        this.dict = {}
    }
    check(username){
        if(this.dict[username] === undefined) this.dict[username] = {count: 0, last_date: null}
        if(this.dict[username].last_date === null || (new Date().getTime()) - this.dict[username].last_date.getTime() > this.max_minutes * 60 * 1000){
            this.dict[username].last_date = new Date()
            this.dict[username].count = 0;
        }else{
            this.dict[username].count += 1;
        }
        if(this.dict[username].count >= this.max_count){
            return false;
        }
        return true;
    }
}

const userCount = new UserCount();

export default class {
    static getTransactions = async (req, res) => {
        const username = req.session.username;
        const transactions = await Transaction.find({
            $or: [{sender: username}, {receiver: username}]
        }).sort({issued_at:-1}).exec();
        res.json({
            messages: [],
            username: username,
            transactions: transactions
        })
    }
    
    static addTransaction = async (req, res) => {
        const username = req.session.username;
        let { receiver, sender, amount, content } = req.body;
        let accepter;
        if(!userCount.check(username)){
            res.json({
                messages: [{type: 'danger', text: 'your action is limited.'}]
            })
            return;
        }
        if(!Number.isInteger(amount)){
            return res.json({ messages: [{type: 'warning', text: 'amount must be integer.'}] });
        }
        if(amount <= 0) {
            return res.json({ messages: [{type: 'warning', text: 'amount must be positive.'}] });
        }
        if(!content){
            return res.json({ messages: [{type:'warning', text:'invalid request. content is required.'}] });
        }
        if(!receiver && !!sender){
            receiver = username
            accepter = sender
        }else if(!!receiver && !sender){
            sender = username
            accepter = receiver
        }else{
            return res.json({ messages: [{type:'warning', text:'invalid request. receiver or sender is required and another is not required.'}] });
        }
        if(username==accepter){
            return res.json({ messages: [{type:'warning', text:'invalid request. accepter is invalid.'}] })
        }
        if(amount>1000000){
            return res.json({ messages: [{type:'warning', text:'invalid request. amount is too numerous.'}] });
        }
        if(!await Friend.findOne({username, friendname: accepter, accepted: true}).exec()){
            return res.json({ messages: [{type:'warning', text:'invalid request. accepter is invalid.'}] });
        }
        const transaction = await Transaction({
            issuer: username,
            issued_at: new Date(),
            accepter, 
            sender, receiver, amount, content
        }).save()
        res.json({ messages: [{type:'info', text:'transaction issued successfully.'}] });
        webpush.sendRequestForAcceptTransaction(transaction);
    }
    
    static acceptTransaction = async (req, res) => {
        const username = req.session.username;
        const transaction_id = req.body.transaction_id
        const transaction = await Transaction.findOne({
            accepter: username, _id: transaction_id, accepted_at: null
        }).exec();
        if(!transaction){
            return res.json({ messages: [{type: 'warning', text: 'transaction is not found.'}] });
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
            return res.json({ messages: [{type: 'warning', text: 'transaction is not found.'}] })
        }
        await Transaction.findOneAndRemove({_id: transaction_id});
        res.json({ messages: [{type: 'info', text: 'declined transaction successfully.'}] });
        webpush.sendMessageForDeclineTransaction(transaction);
    }

    static cancelTransaction = async (req, res) => {
        const username = req.session.username;
        const transaction_id = req.body.transaction_id;
        const transaction = await Transaction.findOne({issuer: username, _id: transaction_id, accepted_at: null}).exec();
        if(!transaction){
            return res.json({ messages: [{type: 'warning', text: 'transaction is not found.'}] })
        }
        await Transaction.findOneAndRemove({_id: transaction_id});
        res.json({ messages: [{type: 'info', text: 'cancel transaction successfully.'}] });
        webpush.sendMessageForCancelTransaction(transaction);
    }
}