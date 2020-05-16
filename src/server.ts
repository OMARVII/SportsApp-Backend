import App from './app';
import * as cron from 'node-cron';
import "../bin/dev"
import { validateEnv } from './utils/ValidateEnv';
import {refresh} from './modules/RefreshDatabase';
import AccountController from './controllers/AccountController';
import ClassController from './controllers/ClassController'
import AnnouncementController from './controllers/AnnouncementController'
import BranchController from './controllers/BranchController'
import AdminController from './controllers/AdminController'

validateEnv();

const app = new App(
    [
        new AccountController(),
        new ClassController(),
        new AnnouncementController(),
        new BranchController(),
        new AdminController()
    ]
);

app.listen();