import App from './app';
import "../bin/dev"
import { validateEnv } from './utils/ValidateEnv';
import AccountController from './controllers/AccountController';


validateEnv();


const app = new App(
    [
        new AccountController(),
    ]
);

app.listen();