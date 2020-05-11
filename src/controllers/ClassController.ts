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
import ReserveClassDTO from './../dto/ReserveClassDTO';
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
        this.router.get(`${this.path}/AllClasses`,authMiddleware,this.getAllClasses);
        this.router.get(`${this.path}/ReservedClasses`,authMiddleware,this.getReservedClasses);
        this.router.get(`${this.path}/FavouriteClasses`,authMiddleware,this.getFavouriteClasses);
        //////////////////////////////////////////////////////////////////////////////////
        this.router.post(`${this.path}`, ImgUpload.single('classImage'),validationMiddleware(AddClassDTO),this.addClass);
        this.router.post(`${this.path}/ReserveClass`,authMiddleware,validationMiddleware(ReserveClassDTO),this.reserveClass);
        //////////////////////////////////////////////////////////////////////////////////
        this.router.put(`${this.path}/Like/:id`,authMiddleware, this.like);   
        ////////////////////////////////////////////////////////////////////////////
        this.router.get(`${this.path}/:id`,authMiddleware,this.getClass);
    }
    private getClass = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const _id = request.params.id;
       await classModel
       .findById(_id,'-__v -createdAt -updatedAt')
       .then((classObj:IClass)=>{
        response.status(200).send(new Response(undefined,classObj).getData());
       })
    }
    private getClassesWithID = async (idArray:string[]) :Promise<IClass[]> => {
        return new Promise (async (resolve,reject)=>{
            await classModel.find({'_id': { $in: idArray }},'-createdAt -updatedAt -__v')
            .then((classes:IClass[])=>{
                resolve(classes);
            })
            .catch(err=>{
                reject(err);
            })
        })
    }
    private getReservedClasses = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        this.getClassesWithID(request.user.reservedClasses)
        .then((classes:IClass[])=>{
            response.status(200).send(new Response(undefined,classes).getData());     
        })
        .catch(err=>{
            next(new SomethingWentWrongException(err));            
        })
    }
    private getFavouriteClasses = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        this.getClassesWithID(request.user.likedClasses)
        .then((classes:IClass[])=>{
            response.status(200).send(new Response(undefined,classes).getData());     
        })
        .catch(err=>{
            next(new SomethingWentWrongException(err));            
        })
    }
    private reserveClass = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const body:ReserveClassDTO = request.body;
        //check if class really exists
        await classModel
        .findById(body.id)
        .then(async (obj:IClass)=>{
            //class exists , assign to user
            if(obj){
                request.user.reservedClasses.push(body.id);
                await request.user.save()
                .then(()=>{
                    response.status(200).send(new Response("Reserved Class Sucessfully",undefined).getData());
                })
                .catch(err=>{
                    next(new SomethingWentWrongException(err));        
                })
            }
            else{
                next(new SomethingWentWrongException(`Class with id ${body.id} dosent exist !`));        
            }
        })
        .catch(err=>{
            next(new SomethingWentWrongException(err));        
        })
    }
    private getAllClasses = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
       await classModel
       .find({},'-__v -createdAt -updatedAt')
       .then((classObj:IClass[])=>{
        let classes = [];
        classObj.forEach(element => {
            let isLiked = false;
            console.log(element);
            if(element.likedUsers.includes(request.user._id)){
            isLiked=true;
            }
            classes.push({...element.toObject(),isLiked,likedUsers:undefined})
        });
        response.status(200).send(new Response(undefined,classes).getData());
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
                        classObj.numberOfLikes += 1;
                        classObj.likedUsers.push(user._id);    
                    }
                    else{
                        classObj.numberOfLikes -= 1;
                        const index = classObj.likedUsers.indexOf(user._id);
                        classObj.likedUsers.splice(index,1);
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
            const imageURL = request.file["location"];
            await classModel
            .create({...classInfo,imageURL})
            .then((classObj:IClass)=>{
            response.status(201).send(new Response('Class Created', undefined).getData());
            })
            .catch((errmsg:any)=>{
            
            next(new SomethingWentWrongException(errmsg))
            })
        }
  }
}
export default ClassController;