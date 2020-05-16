import * as express from 'express';
/////////////////////////////////////////
import branchModel from '../models/Branch';
/////////////////////////////////////////
import IController from '../interfaces/IController';
import IBranch from './../interfaces/IBranch';
import IRequestWithUser from '../interfaces/IRequestWithUser';
/////////////////////////////////////////
import validationMiddleware from '../middlewares/ValidationMiddleware';
import authMiddleware from '../middlewares/auth';
////////////////////////////////////////
import AddBranchDTO from './../dto/AddBranchDTO';
////////////////////////////////////////
import Response from './../modules/Response';
/////////////////////////////////////////
import SomethingWentWrongException from './../exceptions/SomethingWentWrongException';

class BranchController implements IController {
    public path: string;
    public router: express.IRouter;
    constructor() {
        this.path = '/Branch';
        this.router = express.Router();
        this.initializeRoutes();
    }
    public initializeRoutes() {
        this.router.post(`${this.path}`, validationMiddleware(AddBranchDTO), this.addBranch);
        //////////////////////////////////////////////////////////////////////////////////
        this.router.get(`${this.path}/AllBranches`, authMiddleware, this.getAllBranches)
        this.router.get(`${this.path}/:id`, authMiddleware, this.getBranch);

    }
    private getBranch = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const _id = request.params.id;
        await branchModel
            .findById(_id, '-__v -createdAt -updatedAt')
            .then((branch: IBranch) => {
                response.status(200).send(new Response(undefined, branch).getData());
            }).catch(({ error }: any) => {
                next(new SomethingWentWrongException(error))
            })
    }
    private getAllBranches = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        await branchModel.find({}, '-createdAt -updatedAt -__v', (err, branches) => {
            if (err) {
                next(new SomethingWentWrongException());
            }
            else {
                response.status(200).send(new Response(undefined, { branches }).getData());
            }
        })
    }
    private addBranch = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        const branchInfo: AddBranchDTO = request.body;

        await branchModel
            .create({ ...branchInfo })
            .then((branch: IBranch) => {
                response.status(201).send(new Response('Branch Created', undefined).getData());
            })
            .catch(({ error }: any) => {
                next(new SomethingWentWrongException(error))
            })
    }

}
export default BranchController;