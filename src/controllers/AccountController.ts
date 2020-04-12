import * as express from 'express';
/////////////////////////////////////////
import IController from '../interfaces/IController';


class AccountController implements IController {
    public path: string;
    public router: express.IRouter;

    constructor() {
        this.path = '/Account';
        this.router = express.Router();
    }
}
export default AccountController;