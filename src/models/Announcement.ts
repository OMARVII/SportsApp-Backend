import * as mongoose from 'mongoose';
import IAnnouncement from '../interfaces/announcement/IAnnouncement';


const baseOptions = {
    timestamps: true
};

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    publishedDateTime: {
        type: String,
        required: true
    },
    dueDate: {
        type: String,
        required: true
    },
    termsConditions: [{
        type: String,
        required: true
    }],
    imageLocation: {
        type: String,
        required: true
    }
}, baseOptions);

const announcementModel = mongoose.model<IAnnouncement>('announcement', announcementSchema);

export default announcementModel;