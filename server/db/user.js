const mongoose = require('mongoose');

const user = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    passhash: {
        type: String,
        required: true
    },
    groups: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        },
        archived: {
            type: Boolean,
            default: false
        }
    }],
    amount: Number
})

module.exports = mongoose.model('User', user)