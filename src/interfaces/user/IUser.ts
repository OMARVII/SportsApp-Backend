import { Document } from "mongoose";
interface IUser extends Document {
    _id: string;
    role: string;
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

}
export default IUser;