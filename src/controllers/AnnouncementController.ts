import * as express from 'express';
/////////////////////////////////////////
import announcementModel from '../models/Announcement';
/////////////////////////////////////////
import IController from '../interfaces/IController';
import IAnnouncement from './../interfaces/announcement/IAnnouncement';
import IRequestWithUser from '../interfaces/IRequestWithUser';
/////////////////////////////////////////
import validationMiddleware from '../middlewares/ValidationMiddleware';
import authMiddleware from '../middlewares/auth';
import { ImgUpload } from '../middlewares/Upload';
////////////////////////////////////////
import AddAnnouncementDTO from './../dto/AddAnnouncementDTO';
////////////////////////////////////////
import Response from './../modules/Response';
/////////////////////////////////////////
import SomethingWentWrongException from './../exceptions/SomethingWentWrongException';

class AnnouncementController implements IController {
    public path: string;
    public router: express.IRouter;
    constructor() {
        this.path = '/Announcement';
        this.router = express.Router();
        this.initializeRoutes();
    }
    public initializeRoutes() {
        this.router.post(`${this.path}`, ImgUpload.single('announcementImage'), validationMiddleware(AddAnnouncementDTO), this.addAnnouncement);
        //////////////////////////////////////////////////////////////////////////////////
        this.router.get(`${this.path}/AllAnnouncements`, authMiddleware, this.getAllAnnouncements)
        this.router.get(`${this.path}/:id`, authMiddleware, this.getAnnouncement)

    }
    private getAnnouncement = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const _id = request.params.id;
        await announcementModel
            .findById(_id, '-__v -createdAt -updatedAt')
            .then((announcemnet: IAnnouncement) => {
                response.status(200).send(new Response(undefined, announcemnet).getData());
            })
    }
    private getAllAnnouncements = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        await announcementModel.find({}, ' -createdAt -updatedAt -__v -description -dueDate -termsConditions', (err, announcements) => {
            if (err) {
                next(new SomethingWentWrongException());
            }
            else {
                response.status(200).send(new Response(undefined, { announcements }).getData());
            }
        })
    }
    private addAnnouncement = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (request.file === undefined) {
            next(new SomethingWentWrongException('Error: No File Selected!'))
        }
        else {
            const announcementInfo: AddAnnouncementDTO = request.body;
            const imageLocation = request.file["location"];
            await announcementModel
                .create({ ...announcementInfo, imageLocation })
                .then((announcemnet: IAnnouncement) => {
                    response.status(201).send(new Response('Announcement Created', undefined).getData());
                })
                .catch(({ error }: any) => {
                    next(new SomethingWentWrongException(error))
                })
        }
    }
}
export default AnnouncementController;