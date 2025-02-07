import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { InvitationType } from '../../mtypes/InvitationType';
import { customAlphabet } from 'nanoid';
import { NUMBERS } from "maruyu-webcommons/commons/utils/character";
import { HOUR } from 'maruyu-webcommons/commons/utils/time';

export const InvitationModel = mongoose.model<InvitationType>("invitation", 
  (()=>{
    const schema = new mongoose.Schema<InvitationType>({
      invitationId: {
        type: String,
        unique: true,
        required: true,
        default: ()=>uuidv4()
      },
      issuerUserId: {
        type: String,
        required: true,
      },
      invitationCode: {
        type: String,
        required: true,
        unique: true,
        default: ()=>customAlphabet(NUMBERS, 6)()
      },
      issuedAt: {
        type: Date,
        required: true,
        default: ()=>new Date()
      },
      expiredAt: {
        type: Date,
        required: true,
        default: ()=>new Date(Date.now() + 12*HOUR)
      }
    }, {
      timestamps: true
    })
    return schema
  })()
);