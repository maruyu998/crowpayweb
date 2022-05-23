const mongoose = require('mongoose');

const transaction = new mongoose.Schema({
    issuer: {
        type: String,
        required: true
    },
    issued_at: {
        type: Date,
        required: true
    },
    accepter: {
        type: String,
        required: true
    },
    accepted_at: Date,
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
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
})

module.exports = mongoose.model('Transaction', transaction)