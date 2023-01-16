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
        amount: Number,
        wallets: [{
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Wallet'
            },
        }]
    }, {timestamps: true})
);

export default User;