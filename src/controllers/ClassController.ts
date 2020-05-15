import * as express from 'express';
import {Types} from 'mongoose'
/////////////////////////////////////////
import classModel from '../models/Class';
import classLevelModel from '../models/ClassLevel'
import classTypeModel from '../models/ClassType'

/////////////////////////////////////////
import IController from '../interfaces/IController';
import IRequestWithUser from '../interfaces/IRequestWithUser';
import IClass from './../interfaces/class/IClass';
import IClient from './../interfaces/user/IClient';
import IClassLevel from '../interfaces/class/ILevel';

/////////////////////////////////////////
import validationMiddleware from '../middlewares/ValidationMiddleware';
import authMiddleware from '../middlewares/auth';
import { ImgUpload } from '../middlewares/Upload';
////////////////////////////////////////
import AddClassDTO from './../dto/AddClassDTO';
import ReserveClassDTO from './../dto/ReserveClassDTO';
import AddClassLevelDTO from '../dto/AddClassLevelDTO'
import AddClassTypeDTO from '../dto/AddClassTypeDTO'
import ClassFilterDTO from '../dto/ClassFilterDTO';
import RateClassDTO from '../dto/RateClassDTO'
////////////////////////////////////////
import Response from './../modules/Response';
/////////////////////////////////////////
import SomethingWentWrongException from './../exceptions/SomethingWentWrongException';
import IClassType from 'interfaces/class/IType';
import { refresh } from '../modules/RefreshDatabase';

class ClassController implements IController {
    public path: string;
    public router: express.IRouter;
    constructor() {
        this.path = '/Class';
        this.router = express.Router();
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get(`${this.path}/AllClasses`, authMiddleware, this.getAllClasses);
        this.router.get(`${this.path}/ClassLevels`, authMiddleware, this.getClassLevels);
        this.router.get(`${this.path}/ClassTypes`, authMiddleware, this.getClassTypes);
        this.router.get(`${this.path}/ReservedClasses`, authMiddleware, this.getReservedClasses);
        this.router.get(`${this.path}/FavouriteClasses`, authMiddleware, this.getFavouriteClasses);
        this.router.get(`${this.path}/AllClassesByName/:name`, authMiddleware, this.getAllClassesByName);
        this.router.get(`${this.path}/History`, authMiddleware, this.getHistory);
        
        this.router.get(`${this.path}/Type/:id`, authMiddleware, this.getType);
        this.router.get(`${this.path}/Level/:id`, authMiddleware, this.getLevel);
        
        //////////////////////////////////////////////////////////////////////////////////
        this.router.post(`${this.path}`, ImgUpload.single('classImage'), validationMiddleware(AddClassDTO), this.addClass);
        this.router.post(`${this.path}/AllClassesByFilter`, authMiddleware,validationMiddleware(ClassFilterDTO,true),  this.getAllClassesByFilter);
        this.router.post(`${this.path}/ReserveClass`, authMiddleware, validationMiddleware(ReserveClassDTO), this.reserveClass);
        this.router.post(`${this.path}/AddClassLevel`, authMiddleware, validationMiddleware(AddClassLevelDTO), this.addClassLevel);
        this.router.post(`${this.path}/AddClassType`, authMiddleware, validationMiddleware(AddClassTypeDTO), this.addClassType);
        this.router.post(`${this.path}/CancelClassReservation`, authMiddleware, validationMiddleware(ReserveClassDTO), this.cancelClassReservation);
        this.router.post(`${this.path}/RateClass`, authMiddleware, validationMiddleware(RateClassDTO), this.rateClass);

        //////////////////////////////////////////////////////////////////////////////////
        this.router.put(`${this.path}/Like/:id`, authMiddleware, this.like);
        ////////////////////////////////////////////////////////////////////////////
        this.router.get(`${this.path}/:id`, authMiddleware, this.getClass);
    }
    private getLevel = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const _id = request.params.id;
        if(Types.ObjectId.isValid(_id)){
            await classLevelModel
                .findById(_id, '-__v -createdAt -updatedAt')
                .then((level: IClassLevel) => {
                    response.status(200).send(new Response(undefined, level).getData());
                })
        }
        else{
            next(new SomethingWentWrongException('Wrong ID Format'))
        }
    }
    private getType = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const _id = request.params.id;
        if(Types.ObjectId.isValid(_id)){
            await classTypeModel
                .findById(_id, '-__v -createdAt -updatedAt')
                .then((type: IClassType) => {
                    response.status(200).send(new Response(undefined, type).getData());
                })
        }
        else{
            next(new SomethingWentWrongException('Wrong ID Format'))
        }
    }
    private getHistory = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {    
        await refresh().then(async ()=>{
            await classModel.find({_id:{$in:request.user.history}})
        .then((classes:IClass[])=>{
            let returnedClasses = [];
            classes.forEach((c,index) => {
                returnedClasses[index] = c.toObject();
                returnedClasses[index].isRated = false;
                for(let i=0;i<c.ratings.length;i++){
                    if(c.ratings[i].userID === request.user.id){
                        returnedClasses[index].isRated = true;
                        break;
                    }
                }
            });
            response.status(200).send(new Response(undefined, returnedClasses).getData());
        })
        })
    }
    private getClass = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const _id = request.params.id;
        if(Types.ObjectId.isValid(_id)){
            await classModel
                .findById(_id, '-__v -createdAt -updatedAt')
                .then((classObj: IClass) => {
                    response.status(200).send(new Response(undefined, classObj).getData());
                })
        }
        else{
            next(new SomethingWentWrongException('Wrong ID Format'))
        }
    }
    private getClassLevels = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        await classLevelModel
            .find({}, '-__v -createdAt -updatedAt')
            .then((classLevels: IClassLevel[]) => {
                response.status(200).send(new Response(undefined, classLevels).getData());
            })
    }
    private getClassTypes = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        await classTypeModel
            .find({}, '-__v -createdAt -updatedAt')
            .then((classLevels: IClassLevel[]) => {
                response.status(200).send(new Response(undefined, classLevels).getData());
            })
    }
    private addClassLevel = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const level: AddClassLevelDTO = request.body;
        await classLevelModel
            .create(level)
            .then((level: IClassLevel) => {
                response.status(201).send(new Response("Class Level Created Successfully", undefined).getData());
            })
            .catch(err => {
                next(new SomethingWentWrongException(err));
            })
    }
    private addClassType = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const type: AddClassTypeDTO = request.body;
        await classTypeModel
            .create(type)
            .then((level: IClassLevel) => {
                response.status(201).send(new Response("Class Type Created Successfully", undefined).getData());
            })
            .catch(err => {
                next(new SomethingWentWrongException(err));
            })
    }
    private getAllClassesByName = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const searchName = request.params.name;
        if (searchName) {
            await classModel
                .find({ name : new RegExp(searchName,'i'),date: { $gte: new Date()}  }, '-__v -createdAt -updatedAt')
                .then((classObj: IClass[]) => {
                    response.status(200).send(new Response(undefined, classObj).getData());
                })
                .catch(err => {
                    next(new SomethingWentWrongException(err));
                })
        }
        else {
            next(new SomethingWentWrongException("No Name Was Provided"));
        }
    }
    private getAllClassesByFilter = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const filter:ClassFilterDTO =  request.body;
        let query={};
        if(filter.levels){
            query = {
                'level': { $in: filter.levels }
            }
        }
        if(filter.types){
            query = {
                ...query,
                'type': { $in: filter.types }
            }
        }
        if(filter.branches){
            query = {
                ...query,
                'branch': { $in: filter.branches },
            }
        }
        query ={
            ...query,
            'date': { $gte: new Date()} 
        }
        await classModel.find(query)
        .then((classes:IClass[])=>{
            response.status(200).send(new Response(undefined, classes).getData());
        })
        .catch(err=>{
            next(new SomethingWentWrongException(err));
        })
    }
    private getClassesWithID = async (idArray: string[]): Promise<IClass[]> => {
        return new Promise(async (resolve, reject) => {
            await classModel.find({ '_id': { $in: idArray } }, '-createdAt -updatedAt -__v')
                .then((classes: IClass[]) => {
                    resolve(classes);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
    private getReservedClasses = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        this.getClassesWithID(request.user.reservedClasses)
            .then((classes: IClass[]) => {
                response.status(200).send(new Response(undefined, classes).getData());
            })
            .catch(err => {
                next(new SomethingWentWrongException(err));
            })
    }
    private getFavouriteClasses = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        this.getClassesWithID(request.user.likedClasses)
            .then((classes: IClass[]) => {
                response.status(200).send(new Response(undefined, classes).getData());
            })
            .catch(err => {
                next(new SomethingWentWrongException(err));
            })
    }
    private reserveClass = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const body: ReserveClassDTO = request.body;
        //check if class really exists
        await classModel
            .findById(body.id)
            .then(async (obj: IClass) => {
                //class exists , assign to user
                if (obj) {
                    if(request.user.reservedClasses.includes(body.id)){
                        response.status(200).send(new Response("Class Already Reserved", undefined).getData());
                    }
                    else if(obj.date< new Date()){
                        response.status(200).send(new Response(`Class was scheduled on ${obj.date}, which has passed :(`, undefined).getData());    
                    }
                    else{
                        request.user.reservedClasses.push(body.id);
                    await request.user.save()
                        .then(async () => {
                            obj.users.push(request.user._id)
                            await obj.save().then(() => {
                                response.status(200).send(new Response("Reserved Class Sucessfully", undefined).getData());
                            })
                                .catch(err => {
                                    next(new SomethingWentWrongException(err));
                                })
                        })
                        .catch(err => {
                            next(new SomethingWentWrongException(err));
                        })
                    }
                }
                else {
                    next(new SomethingWentWrongException(`Class with id ${body.id} dosent exist !`));
                }
            })
            .catch(err => {
                next(new SomethingWentWrongException(err));
            })
    }
    private cancelClassReservation = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const body: ReserveClassDTO = request.body;
        //check if class really exists
        await classModel
            .findById(body.id)
            .then(async (obj: IClass) => {
                //class exists , assign to user
                if (obj) {
                    if(!request.user.reservedClasses.includes(obj._id)){
                        next(new SomethingWentWrongException("You didnt reserve for this class"));
                    }
                    else{
                        const index = request.user.reservedClasses.indexOf(obj._id);
                        request.user.reservedClasses.splice(index, 1);
                    await request.user.save()
                        .then(async() => {
                            const index = obj.users.indexOf(request.user._id);
                            obj.users.splice(index,1);
                            await obj.save().then((value:IClass)=>{
                                response.status(200).send(new Response("Removed Class Reservation Sucessfully", undefined).getData());
                            })
                            .catch(err=>{
                                next(new SomethingWentWrongException(err));        
                            })
                        })
                        .catch(err => {
                            next(new SomethingWentWrongException(err));
                        })
                    }
                }
                else {
                    next(new SomethingWentWrongException(`Class with id ${body.id} dosent exist !`));
                }
            })
            .catch(err => {
                next(new SomethingWentWrongException(err));
            })
    }
    private getAllClasses = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        await classModel
            .find({ date: { $gte: new Date()} }, '-__v -createdAt -updatedAt')
            .then((classObj: IClass[]) => {
                let classes = [];
                classObj.forEach(element => {
                    let isLiked = false;
                    if (element.likedUsers.includes(request.user._id)) {
                        isLiked = true;
                    }
                    classes.push({ ...element.toObject(), isLiked, likedUsers: undefined })
                });
                response.status(200).send(new Response(undefined, classes).getData());
            })
    }
    private like = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const _id = request.params.id;
        const user = request.user;
        const { status } = request.body;
        if (!_id) {
            next(new SomethingWentWrongException("No Class ID Provided"));
        }
        else if(!Types.ObjectId.isValid(_id)){
            next(new SomethingWentWrongException("Wrong ID Format"));    
        }
        else {
            await classModel
                .findById(_id)
                .then(async (classObj: IClass) => {
                    if(classObj){
                        const userStatus = classObj.likedUsers.includes(request.user._id);
                        if (status) {
                            if(!userStatus){
                                classObj.numberOfLikes += 1;
                                classObj.likedUsers.push(user._id); 
                            }
                        }
                        else {
                            if(userStatus){
                                classObj.numberOfLikes -= 1;
                                const index = classObj.likedUsers.indexOf(user._id);
                                classObj.likedUsers.splice(index, 1);
                            }
                        }
                        await classObj
                            .save()
                            .then(async (classObj: IClass) => {
                                if (status && !userStatus) {
                                    user.likedClasses.push(classObj._id);
                                }
                                else if(!status&&userStatus){
                                    const index = user.likedClasses.indexOf(classObj._id);
                                    user.likedClasses.splice(index, 1);
                                }
                                await user
                                    .save()
                                    .then((user: IClient) => {
                                        let message = 'Class ';
                                        status ? message += 'Liked' : message += 'Disliked'
                                        response.status(200).send(new Response(message, undefined).getData());
                                    })
                                    .catch(({ errmsg }) => {
                                        next(new SomethingWentWrongException(errmsg))
                                    })
                            })
                            .catch((err) => {
                                next(new SomethingWentWrongException(err))
                            })
                    }
                    else{
                        next(new SomethingWentWrongException(`Class with ID ${_id} Not Found`))
                    }
                })
                .catch((message) => {
                    next(new SomethingWentWrongException(`Class with ID ${_id} Not Found`))
                })
        }
    }
    private addClass = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (request.file === undefined) {
            next(new SomethingWentWrongException('Error: No File Selected!'))
        }
        else {
            const classInfo: AddClassDTO = request.body;
            const imageURL = request.file["location"];
            await classModel
                .create({ ...classInfo, imageURL })
                .then((classObj: IClass) => {
                    response.status(201).send(new Response('Class Created', undefined).getData());
                })
                .catch((errmsg: any) => {

                    next(new SomethingWentWrongException(errmsg))
                })
        }
    }
    private rateClass = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const rating: RateClassDTO = request.body;
         if(request.user.history.includes(rating.id)){
                await classModel
                .findById(rating.id, '-__v -createdAt -updatedAt')
                .then((classObj: IClass) => {
                    classObj.ratings.push({rate:rating.rate,feedback:rating.feedback,userID:request.user._id});
                    let totalRate:number;
                    for(let i=0;i<classObj.ratings.length;i++){
                        totalRate += classObj.ratings[i].rate;
                    }
                    totalRate/=classObj.ratings.length;
                    classObj.totalRate = Math.ceil(totalRate);
                    classObj.save().then(() => {
                        response.status(201).send(new Response('Rated Class Succesfully', undefined).getData());
                    })
                })
                .catch(err=>{
                   next(new SomethingWentWrongException(err))
                })
            }
             else{
                 next(new SomethingWentWrongException("You Didn't Attend The Class Yet"))
             }
    }
}
export default ClassController;