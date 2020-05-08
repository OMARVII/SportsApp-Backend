import * as express from 'express';
/////////////////////////////////////////
import classModel from '../models/Class';
/////////////////////////////////////////
import IController from '../interfaces/IController';
import IRequestWithUser from '../interfaces/IRequestWithUser';
import IClass from './../interfaces/class/IClass';  
import IUser from './../interfaces/user/IUser';
/////////////////////////////////////////
import validationMiddleware from '../middlewares/ValidationMiddleware';
import authMiddleware from '../middlewares/auth';
import {ImgUpload} from '../middlewares/Upload';
////////////////////////////////////////
import AddClassDTO from './../dto/AddClassDTO';
////////////////////////////////////////
import Response from './../modules/Response';
/////////////////////////////////////////
import SomethingWentWrongException from './../exceptions/SomethingWentWrongException';

class ClassController implements IController {
    public path: string;
    public router: express.IRouter;
    constructor() {
        this.path = '/Class';
        this.router = express.Router();
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get(`${this.path}/:id`,authMiddleware,this.getClass);
        //////////////////////////////////////////////////////////////////////////////////
        this.router.post(`${this.path}`, ImgUpload.single('classImage'),validationMiddleware(AddClassDTO),this.addClass);
        //////////////////////////////////////////////////////////////////////////////////
        this.router.put(`${this.path}/Like/:id`,authMiddleware, this.like);   
    }
    private getClass = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const _id = request.params.id;
       await classModel
       .findById(_id,'-__v -createdAt -updatedAt')
       .then((classObj:IClass)=>{
        response.status(200).send(new Response(undefined,classObj).getData());
       })
    }
    private like = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const _id = request.params.id;
        const user= request.user;
        const {status} = request.body;
        if(!_id){
            next(new SomethingWentWrongException("No Class ID Provided"));        
        }
        else{
                await classModel
                .findById(_id)
                .then(async (classObj:IClass)=>{
                    if(status){
                        classObj.likes.numberOfLikes += 1;
                        classObj.likes.users.push(user._id);    
                    }
                    else{
                        classObj.likes.numberOfLikes -= 1;
                        const index = classObj.likes.users.indexOf(user._id);
                        classObj.likes.users.splice(index,1);
                    }
                    await classObj
                    .save()
                    .then(async (classObj:IClass)=>{
                        if(status){
                            user.likedClasses.push(classObj._id);
                        }
                        else{
                            const index = user.likedClasses.indexOf(classObj._id);
                            user.likedClasses.splice(index,1);
                        }
                        await user
                        .save()
                        .then((user:IUser)=>{
                            let message='Class ';
                            status? message+='Liked' : message+='Disliked'
                            response.status(200).send(new Response(message, undefined).getData());
                        })
                        .catch(({errmsg})=>{
                            next(new SomethingWentWrongException(errmsg))                
                        })
                    })
                    .catch(({errmsg})=>{
                        next(new SomethingWentWrongException(errmsg))        
                    })
                })
                .catch(({message})=>{
                    next(new SomethingWentWrongException(message))
                })
        }
        
    }
    private addClass = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if( request.file === undefined ){
        next(new SomethingWentWrongException('Error: No File Selected!'))
        }
        else {
            const classInfo:AddClassDTO = request.body;
            const imageLocation = request.file["location"];
            await classModel
            .create({...classInfo,imageLocation})
            .then((classObj:IClass)=>{
            response.status(201).send(new Response('Class Created', undefined).getData());
            })
            .catch(({errmsg}:any)=>{
            next(new SomethingWentWrongException(errmsg))
            })
        }
  }
}
export default ClassController;