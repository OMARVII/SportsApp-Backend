import App from './app';
import "../bin/dev"
import { validateEnv } from './utils/ValidateEnv';
import AccountController from './controllers/AccountController';
import ClassController from './controllers/ClassController'

validateEnv();


const app = new App(
    [
        new AccountController(),
        new ClassController()
    ]
);

app.listen();