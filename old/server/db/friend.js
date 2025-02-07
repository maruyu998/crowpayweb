import mongoose from 'mongoose';

const Friend = mongoose.model('Friend', 
    new mongoose.Schema({
        username: {
            type: String,
            required: true,
            lowercase: true
        },
        friendname: {
            type: String,
            required: true,
            lowercase: true
        },
        accepted: {
            type: Boolean,
            default: false
        }
    }, {timestamps: true})
)

export default Friend;