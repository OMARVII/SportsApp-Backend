import * as express from 'express';
import * as bcrypt from 'bcrypt';
/////////////////////////////////////////
import clientModel from '../models/user/Client';
/////////////////////////////////////////
import IController from '../interfaces/IController';
import IClient from '../interfaces/user/IClient';
import IRequestWithUser from '../interfaces/IRequestWithUser';
/////////////////////////////////////////
import validationMiddleware from '../middlewares/ValidationMiddleware';
import authMiddleware from '../middlewares/auth';
import { ImgUpload } from '../middlewares/Upload';
////////////////////////////////////////
import LogInDto from './../dto/LoginDTO';
import RegisterDTO from './../dto/RegisterDTO';
import UpdateClientDTO from './../dto/UpdateClientDTO';
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
        ///////////////////////////////////////////////////////////////////////////////////
        this.router.get(`${this.path}/getProfileData`, authMiddleware, this.getProfileData)
        this.router.patch(`${this.path}`, ImgUpload.single('profilePicture'), authMiddleware, validationMiddleware(UpdateClientDTO), this.updateAccount);

    }

    private updateAccount = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        let newData: UpdateClientDTO = request.body;
        const imageURL = request.file["location"];
        newData["profilePicture"] = imageURL;
        let newObj = {};
        Object.keys(newData).forEach((prop) => {
            if (newData[prop]) { newObj[prop] = newData[prop]; }
        });
        try {
            let newUser = await clientModel.findByIdAndUpdate(request.user._id, { $set: newObj });
            response.status(200).send(new Response('Updated Successfuly!').getData());
        }
        catch {
            next(new SomethingWentWrongException());
        }
    }
    private validateToken = async (quest: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        response.status(200).send(new Response(undefined, { result: true }).getData());
    }
    private login = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const logInData: LogInDto = request.body;
        await clientModel.findOne({ email: logInData.email.toLowerCase() }, async (err, user: IClient) => {
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
        if (await clientModel.findOne({ email: userData.email.toLowerCase() })) {
            next(new UserWithThatEmailAlreadyExistsException(userData.email));
        }
        else {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            try {
                await clientModel.create({
                    ...userData,
                    password: hashedPassword,
                }, (err: any, user: IClient) => {
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
    private getProfileData = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        console.log("ee")

        let account: IClient = await clientModel.findById(request.user._id, ' -password -_id -createdAt -updatedAt -__v');
        let returnedAccount = account.toObject();
        response.status(200).send(new Response(undefined, { returnedAccount }).getData());
    }
}
export default AccountController;