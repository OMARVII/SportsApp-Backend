import { Document } from "mongoose";
interface IBranch extends Document {
    place: string;
    latitude: string;
    longitude: string;
}
export default IBranch;