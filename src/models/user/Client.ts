import * as mongoose from 'mongoose';
import User from './User';
import IClient from '../../interfaces/user/IClient';

const Client = User.discriminator('Client', new mongoose.Schema({
    profilePicture: {
        type: String,
        default: "https://sports-app-bucket.s3.eu-west-3.amazonaws.com/profilePictureTemplate.png"
    },
    likedClasses: [{
        ref: 'class',
        type: mongoose.Schema.Types.ObjectId
    }],
    reservedClasses: [{
        ref: 'class',
        type: mongoose.Schema.Types.ObjectId
    }],
    history: [{
        ref: 'class',
        type: mongoose.Schema.Types.ObjectId
    }]
}));

const clientModel = mongoose.model<IClient>('Client');

export default clientModel;