import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import IController from './interfaces/IController';
import errorMiddleware from './middlewares/ErrorMiddleware';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';
class App {

    private app: express.Application;
    private PORT: any;

    constructor(controllers: IController[]) {

        this.app = express();
        this.PORT = process.env.PORT || 5000;

        this.connectToDatabase();

        this.initializeMiddlewares();


        this.initializeControllers(controllers);

        this.app.use("/", swaggerUi.serve,swaggerUi.setup(swaggerDocument));

        this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json({ limit: '100mb' }));
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: IController[]) {
        controllers.forEach((controller) => {
            this.app.use('/api', controller.router);
        });
    }

    private connectToDatabase() {
        const {
            MONGODB_URL
        } = process.env;

        mongoose
            .connect(MONGODB_URL.toString(), { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
            .then((result) => {
                // handle connnection succedded
                console.log("CONNECTED TO DB")
            })
            .catch((err: Error) => {
                // handle error database 
                console.log(err);
            })
    }

    public listen() {
        this.app.listen(this.PORT, () => {
            console.log(`App listening on the port ${this.PORT}`);
        });
    }
}
export default App;