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
    }
}, baseOptions);

const userModel = mongoose.model<IUser>('users', userSchema);

export default userModel;