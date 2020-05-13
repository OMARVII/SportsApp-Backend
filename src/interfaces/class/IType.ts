import { Document } from "mongoose";
interface IClassType extends Document {
    _id: string;
    name: string;
}
export default IClassType;