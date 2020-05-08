import { Document } from "mongoose";
interface IUser extends Document {
    _id: string;
    fullName: string;
    email: string;
    password: string;
    birthDate: {
        day: number,
        month: number,
        year: number
    };
    gender: string;
    mobile: string;
    likedClasses:string[];
}
export default IUser;