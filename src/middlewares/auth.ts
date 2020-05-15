import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/auth/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/auth/WrongAuthenticationTokenException';
import IDataStoredInToken from '../interfaces/token/IDataStoredInToken';
import IRequestWithUser from '../interfaces/IRequestWithUser';
import clientModel from '../models/user/User';
import IClient from './../interfaces/user/IClient';
import SomethingWentWrongException from '../exceptions/SomethingWentWrongException';

async function authMiddleware(request: IRequestWithUser, response: Response, next: NextFunction) {
    const headers = request.headers;
    if(headers["authorization"]){
        const secret = process.env.JWT_SECRET;
        try{
            const verificationResponse =  jwt.verify(headers['authorization'].split(" ")[1],secret) as IDataStoredInToken;
            const _id = verificationResponse._id;
            await clientModel.findById(_id,'-password -createdAt -updatedAt -__v',(err,user:IClient)=>{
                if(err){
                    next(new SomethingWentWrongException());
                }
                else{
                    request.user = user;
                    next();
                }
            });
        }catch(error){
            next(new WrongAuthenticationTokenException());
        }
    }else{
        next(new AuthenticationTokenMissingException());
    }
}

export default authMiddleware;
