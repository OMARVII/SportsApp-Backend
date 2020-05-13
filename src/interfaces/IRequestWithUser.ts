import { Request } from 'express';
import IClient from './user/IClient';
 
interface IRequestWithUser extends Request {
  user: IClient;
}
 
export default IRequestWithUser;