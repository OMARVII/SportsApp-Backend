import { Router } from 'express';

interface IController {
    router: Router;
    path: string;
    initializeRoutes():void
}

export default IController;