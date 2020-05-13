import * as mongoose from 'mongoose';
import IUser from '../interfaces/user/IUser';


const baseOptions = {
    timestamps: true
};

const userSchema = new mongoose.Schema({
    fullName: {
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:"https://sports-app-bucket.s3.eu-west-3.amazonaws.com/profilePictureTemplate.png"
    },
    birthDate: {
        day: {
            type: Number,
        },
        month: {
            type: Number,
        },
        year: {
            type: Number,
        }
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
    },
    mobile: {
        type: String,
        required:true
    },
    likedClasses:[{
        ref: 'class',
        type: mongoose.Schema.Types.ObjectId
    }],
    reservedClasses:[{
        ref: 'class',
        type: mongoose.Schema.Types.ObjectId
    }],
    history:[{
        ref: 'class',
        type: mongoose.Schema.Types.ObjectId
    }]
}, baseOptions);

const userModel = mongoose.model<IUser>('User', userSchema);

export default userModel;