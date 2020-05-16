import * as mongoose from 'mongoose';
import IPushToken from '../interfaces/IPushToken';


const baseOptions = {
    timestamps: true
};

const pushTokenSchema = new mongoose.Schema({
   token:{
       type:String,
       required:true,
       unique:true
   }
}, baseOptions);

const pushTokenModel = mongoose.model<IPushToken>('PushToken', pushTokenSchema);

export default pushTokenModel;