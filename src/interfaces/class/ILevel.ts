import { Document } from "mongoose";
interface IClassLevel extends Document {
    _id: string;
    name: string;
}
export default IClassLevel;