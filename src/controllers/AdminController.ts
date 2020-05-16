import * as express from 'express';
import * as bcrypt from 'bcrypt';
/////////////////////////////////////////
import adminModel from '../models/user/Admin';
/////////////////////////////////////////
import IController from '../interfaces/IController';
import IAdmin from '../interfaces/user/IAdmin';
/////////////////////////////////////////
import validationMiddleware from '../middlewares/ValidationMiddleware';


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
        this.path = '/Admin';
        this.router = express.Router();
        this.tokenManager = new TokenManager();
        this.initializeRoutes();
    }
    public initializeRoutes() {
        this.router.post(`${this.path}/Login`, validationMiddleware(LogInDto), this.login);
        this.router.post(`${this.path}/Register`, validationMiddleware(RegisterDTO), this.register);
    }


    private login = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const logInData: LogInDto = request.body;
        await adminModel.findOne({ email: logInData.email.toLowerCase() }, async (err, user: IAdmin) => {
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
                else {
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
        if (await adminModel.findOne({ email: userData.email.toLowerCase() })) {
            next(new UserWithThatEmailAlreadyExistsException(userData.email));
        }
        else {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            try {
                await adminModel.create({
                    ...userData,
                    password: hashedPassword,
                }, (err: any, user: IAdmin) => {
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