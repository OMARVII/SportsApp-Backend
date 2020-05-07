import * as express from 'express';
import * as bcrypt from 'bcrypt';
/////////////////////////////////////////
import userModel from '../models/User';
/////////////////////////////////////////
import IController from '../interfaces/IController';
import IUser from '../interfaces/user/IUser';
import IRequestWithUser from '../interfaces/IRequestWithUser';
/////////////////////////////////////////
import validationMiddleware from '../middlewares/ValidationMiddleware';
import authMiddleware from '../middlewares/auth';
import {ImgUpload} from '../middlewares/Upload';
////////////////////////////////////////
import LogInDto from './../dto/LoginDTO';
import RegisterDTO from './../dto/RegisterDTO';
////////////////////////////////////////
import TokenManager from '../modules/TokenManager';
import Response from './../modules/Response';
/////////////////////////////////////////
import WrongCredentialsException from './../exceptions/WrongCredentialsException';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import SomethingWentWrongException from './../exceptions/SomethingWentWrongException';
  
class AccountController implements IController {
    public path: string;
    public router: express.IRouter;
    private tokenManager: TokenManager;
    constructor() {
        this.path = '/Account';
        this.router = express.Router();
        this.tokenManager = new TokenManager();
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get(`${this.path}/ValidateToken`, authMiddleware, this.validateToken);
        ///////////////////////////////////////////////////////////////////////////////////
        this.router.post(`${this.path}/Login`, validationMiddleware(LogInDto), this.login);
        this.router.post(`${this.path}/Register`, validationMiddleware(RegisterDTO), this.register);
    }
    private validateToken = async (quest: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        response.status(200).send(new Response(undefined, { result: true }).getData());
    }
    private login = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const logInData: LogInDto = request.body;
        await userModel.findOne({ email: logInData.email.toLowerCase() }, async (err, user: IUser) => {
            if (err) {
                next(new SomethingWentWrongException());
            }
            try {
                const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
                if (isPasswordMatching) {
                    user.password = undefined;
                    const token = this.tokenManager.getToken({ _id: user._id });
                    response.status(200).send(new Response('Login success', { token }).getData());
                }
                else{
                    next(new WrongCredentialsException());
                }
            }
            catch {
                next(new WrongCredentialsException());
            }

        });
    }
    private register = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userData: RegisterDTO = request.body;
        if (await userModel.findOne({ email: userData.email.toLowerCase() })) {
            next(new UserWithThatEmailAlreadyExistsException(userData.email));
        }
        else {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            try {
                await userModel.create({
                    ...userData,
                    password: hashedPassword,
                }, (err: any, user: IUser) => {
                    if (err) {
                        next(new SomethingWentWrongException());
                    }
                    else {
                        user.password = undefined;

                        const token = this.tokenManager.getToken({ _id: user._id });
                        response.status(201).send(new Response('Registered successfully', { token }).getData());

                    }
                });
            }
            catch{
                next(new SomethingWentWrongException());
            }
        }
    }
}
export default AccountController;