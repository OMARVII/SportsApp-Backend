import * as mongoose from 'mongoose';
import IClassLevel from '../interfaces/class/ILevel';


const baseOptions = {
    timestamps: true
};

const classLevelSchema = new mongoose.Schema({
   name:{
       type:String,
       required:true,
       unique:true
   }
}, baseOptions);

const classLevelModel = mongoose.model<IClassLevel>('ClassLevel', classLevelSchema);

export default classLevelModel;