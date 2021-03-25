import express, {Request, Response} from "express";
import {getCashier, createCashier, updateCashier, deleteCashier} from './db';
import {ICashier} from './model';

export const appRouter = express.Router();

const callback = (res: Response) => (err: Error, rowCount: Number) =>
  err ?	res.status(500).json({"message": err.message}):
		res.status(200).json({"rowCount": rowCount});

appRouter.get("/", (req: Request, res: Response) => {
	getCashier((err: Error, cashiers: ICashier[]) => {
		if (err)
			res.status(500).json({"errorMessage": err.message})
		else {
			res.status(200).json({"cashiers": cashiers});
			console.table(cashiers);
		}
	}, req);
});

appRouter.post("/", (req: Request, res: Response) => {
	createCashier(<ICashier> req.body, callback(res));
});

appRouter.put("/:id", (req: Request, res: Response) => {
	updateCashier(<ICashier> req.body, callback(res), Number(req.params.id));
});

appRouter.delete("/:id", (req: Request, res: Response) => {
	deleteCashier(Number(req.params.id), callback(res));
});