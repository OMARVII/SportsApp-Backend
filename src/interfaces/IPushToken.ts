import { Document } from "mongoose";

interface IPushToken extends Document {
    token:string;
}
export default IPushToken;