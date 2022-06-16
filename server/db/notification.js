import mongoose from 'mongoose';

const Notification = mongoose.model('Notification', 
    new mongoose.Schema({
        username: {
            type: String,
            required: true,
            lowercase: true
        },
        title: {
            type: String
        },
        message: {
            type: String,
        },
        read: {
            type: Boolean,
            default: false
        },
        created_at: {
            type: Date,
            default: ()=>new Date()
        }
    }, {timestamp: true})
)

export default Notification;