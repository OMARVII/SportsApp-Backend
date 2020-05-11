import * as mongoose from 'mongoose';
import IClass from '../interfaces/class/IClass';


const baseOptions = {
    timestamps: true
};

const classSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        unique:true
    },
    level: {
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    place:{
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    date:{
        type:Date,
        required:true
    },
    numberOfLikes:{
        type:Number,
       default:0
    },
    likedUsers:[{
        ref: 'users',
        type: mongoose.Schema.Types.ObjectId
    }],
    imageURL:{
        type:String,
        required:true
    }
}, baseOptions);

const classModel = mongoose.model<IClass>('class', classSchema);

export default classModel;