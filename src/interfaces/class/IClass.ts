import { Document } from "mongoose";
interface IClass extends Document {
    _id: string;
    name: string;
    level: string;
    place: string;
    type:string;
    likes: {
        numberOfLikes:number,
        users:string[]
    };
    imageLocation:string;
}
export default IClass;