import * as mongoose from 'mongoose';
import IUser from '../../interfaces/user/IUser';


const baseOptions = {
    discriminatorKey: 'role',
    collection: 'users',
    timestamps: true
};

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    birthDate: {
        type: String,
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
        required: true
    },

}, baseOptions);

const userModel = mongoose.model<IUser>('user', userSchema);
 
export default userModel;