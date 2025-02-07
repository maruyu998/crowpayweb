import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { WalletType } from '../../mtypes/WalletType';

export const WalletModel = mongoose.model<WalletType>("wallet", 
  (()=>{
    const schema = new mongoose.Schema<WalletType>({
      walletId: {
        type: String,
        unique: true,
        required: true,
        default: ()=>uuidv4()
      },
      walletName: {
        type: String,
        unique: true,
        required: true
      }
    }, {
      timestamps: true
    })
    return schema
  })()
);