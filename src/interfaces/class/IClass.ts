import { Document } from "mongoose";
import IRating from './IRating';
interface IClass extends Document {
    _id: string;
    name: string;
    level: string;
    place: string;
    type:string;
    numberOfLikes:number;
    likedUsers:string[];
    imageURL:string;
    users:string[];
    ratings:IRating[]
}
export default IClass;