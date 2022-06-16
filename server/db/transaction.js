import mongoose from 'mongoose';

const Transaction = mongoose.model('Transaction', 
    new mongoose.Schema({
        issuer: {
            type: String,
            required: true,
            lowercase: true
        },
        issued_at: {
            type: Date,
            required: true
        },
        accepter: {
            type: String,
            required: true,
            lowercase: true
        },
        accepted_at: Date,
        sender: {
            type: String,
            required: true,
            lowercase: true
        },
        receiver: {
            type: String,
            required: true,
            lowercase: true
        },
        content: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        raw_amount: Number,
        rate: Number,
        unit: String
    }, {timestamp: true})
)
export default Transaction;