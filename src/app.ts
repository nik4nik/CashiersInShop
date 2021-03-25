import express, {Application, Request, Response, NextFunction} from 'express';
import {appRouter} from "./appRouter";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import {getTargetCashiers1, getTargetCashiers2, getAllCashiers} from './db';

dotenv.config();
const port = Number(process.env.PORT || 3000);
const logRequest = (req: Request, res: Response, next: NextFunction) => {
	console.log(req);
	next();
}

const app: Application = express();
app.use(logRequest);
app.use(bodyParser.json());
app.use("/cashiers", appRouter);

app.listen(port, () => {
    console.log('Server started on port %s', port);
});

getAllCashiers();
getTargetCashiers1(1);
getTargetCashiers2();