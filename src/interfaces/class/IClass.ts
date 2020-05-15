import { Document } from "mongoose";
import IRating from './IRating';
interface IClass extends Document {
    _id: string;
    name: string;
    level: string;
    branch: string;
    type:string;
    numberOfLikes:number;
    likedUsers:string[];
    imageURL:string;
    users:string[];
    date:Date;
    ratings:IRating[];
    totalRate:number;
}
export default IClass;