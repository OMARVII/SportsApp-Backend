import IUser from './IUser';
interface IClient extends IUser {
    likedClasses: string[];
    reservedClasses: string[];
    history: string[];
    profilePicture: string;
}

export default IClient;
