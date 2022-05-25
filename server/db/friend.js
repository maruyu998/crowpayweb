import mongoose from 'mongoose';

const Friend = mongoose.model('Friend', 
    new mongoose.Schema({
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
)

export default Friend;