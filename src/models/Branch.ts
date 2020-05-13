import * as mongoose from 'mongoose';
import IBranch from '../interfaces/IBranch';


const baseOptions = {
    timestamps: true
};

const branchSchema = new mongoose.Schema({
    place: {
        type: String,
        required: true,
        unique: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    }
}, baseOptions);

const branchModel = mongoose.model<IBranch>('branch', branchSchema);

export default branchModel;