import mongoose from 'mongoose';

const Invitation = mongoose.model('Invitation', 
    new mongoose.Schema({
      issuer: {
        type: String,
        required: true
      },
      code: {
        type: String,
        required: true
      },
      expirationdate: {
        type: Date,
        required: true
      }
    }, {timestamps: true})
);

export default Invitation;