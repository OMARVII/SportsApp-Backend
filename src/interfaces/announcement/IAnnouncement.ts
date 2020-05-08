import { Document } from "mongoose";
interface IAnnouncement extends Document {
    _id: string;
    title: string;
    description: string;
    publishedDateTime: string;
    dueDate: string;
    termsConditions: string[];
    imageLocation: string;
}
export default IAnnouncement;