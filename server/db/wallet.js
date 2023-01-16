import mongoose from 'mongoose';

const Wallet = mongoose.model('Wallet', 
    new mongoose.Schema({
        name: String, 
    }, {timestamps: true})
);

export default Wallet;