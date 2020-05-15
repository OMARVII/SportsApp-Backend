import * as mongoose from 'mongoose';
import IClassType from '../interfaces/class/IType';

const baseOptions = {
    timestamps: true
};

const classTypeSchema = new mongoose.Schema({
   name:{
       type:String,
       required:true,
       unique:true
   }
}, baseOptions);

const classTypeModel = mongoose.model<IClassType>('Class Type', classTypeSchema);

export default classTypeModel;