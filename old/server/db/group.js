const mongoose = require('mongoose');


const group = new mongoose.Schema({
    groupname: String,
    members: [{
        username: {
            type: String,
            required: true
        },
        accepted: {
            type: Boolean,
            default: false
        }
    }]
})

module.exports = mongoose.model('Group', group)