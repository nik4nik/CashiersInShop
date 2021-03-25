import express, {Application, Request, Response, NextFunction} from 'express';
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";

dotenv.config();
const port = Number(process.env.PORT || 3000);
const logRequest = (req: Request, res: Response, next: NextFunction) => {
	console.log(req);
	next();
}

const app: Application = express();
app.use(logRequest);
app.use(bodyParser.json());

app.listen(port, () => {
    console.log('Server started on port %s', port);
});
