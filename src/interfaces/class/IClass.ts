import { Document } from "mongoose";
interface IClass extends Document {
    _id: string;
    name: string;
    level: string;
    place: string;
    type:string;
    numberOfLikes:number;
    likedUsers:string[];
    imageURL:string;
}
export default IClass;