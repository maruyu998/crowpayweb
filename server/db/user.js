import mongoose from 'mongoose';

const User = mongoose.model('User', 
    new mongoose.Schema({
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
);

export default User;