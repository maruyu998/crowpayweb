import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { TransactionType } from '../../mtypes/TransactionType';

export const TransactionModel = mongoose.model<TransactionType>("transaction", 
  (()=>{
    const schema = new mongoose.Schema<TransactionType>({
      transactionId: {
        type: String,
        unique: true,
        required: true,
        default: ()=>uuidv4()
      },
      senderUserId: {
        type: String,
        required: true,
      },
      receiverUserId: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true
      },
      issuerUserId: {
        type: String,
        required: true,
      },
      issuedAt: {
        type: Date,
        required: true,
      },
      accepterUserId: {
        type: String,
        required: true,
      },
      acceptedAt: {
        type: Date,
        default: null
      },
    }, {
      timestamps: true
    })
    return schema
  })()
);