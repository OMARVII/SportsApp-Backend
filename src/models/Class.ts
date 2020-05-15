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
        ref:'ClassLevel',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    branch:{
        ref:'branch',
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    type: {
        ref:'Class Type',
        type: mongoose.Schema.Types.ObjectId,
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
    users:[{
        ref: 'users',
        type: mongoose.Schema.Types.ObjectId
    }],
    likedUsers:[{
        ref: 'users',
        type: mongoose.Schema.Types.ObjectId
    }],
    imageURL:{
        type:String,
        required:true
    },
    totalRate:{
        type:Number
    },
    ratings:[{
        userID:{
            ref:'users',
            type:mongoose.Types.ObjectId
        },
        rate:{
            type:Number
        },
        feedback:{
            type:String
        }
    }]
}, baseOptions);
// classSchema.pre("remove",function(callback){
//     this.model('users')
//     .update({_id:{$in: this.users}},
//         {$pull: {groups: this._id}}, 
//         {multi: true},
//         callback)
// });

const classModel = mongoose.model<IClass>('Class', classSchema);

export default classModel;