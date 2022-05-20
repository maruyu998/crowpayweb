const mongoose = require('mongoose');

const friend = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    friendname: {
        type: String,
        required: true
    },
    accepted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Friend', friend)