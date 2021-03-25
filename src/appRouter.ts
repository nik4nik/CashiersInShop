import express, {Request, Response} from "express";
import {getCashier, createCashier, updateCashier, deleteCashier} from './db';
import {ICashier} from './model';

export const appRouter = express.Router();

const handler = (f: Function) => async (req: Request, res: Response) => {
	f(async (err: Error, cashiers: ICashier[]) => {
		if (err)
			res.status(500).json({"errorMessage": err.message})
		else {
			res.status(200).json({"data": cashiers});
			await console.table(cashiers);
		}
	}, req.params.id);
};

// Create a cashier
appRouter.post("/", async (req: Request, res: Response) => {
  createCashier(<ICashier> req.body, (err: Error, cashierId: number) => {
    if (err) {
      return res.status(500).json({"message": err.message});
    }
	console.table(cashierId);
    res.status(200).json({"cashierId": cashierId});
  });
});
// http://localhost:3000/cashiers
// Read a cashier
appRouter.get("/:id", handler(getCashier));

// Update a cashier
appRouter.put("/:id", async (req: Request, res: Response) => {
  updateCashier(<ICashier> req.body, (err: Error, cashierId: number) => {
    if (err) {
      return res.status(500).json({"message": err.message});
    }
    res.status(200).json({"cashierId": cashierId});
  }, Number(req.params.id));
});

// Delete a cashier
appRouter.delete("/:id", async (req: Request, res: Response) => {
  deleteCashier(Number(req.params.id), (err: Error, cashierId: number) => {
    if (err) {
      return res.status(500).json({"message": err.message});
    }
    res.status(200).json({"cashierId": cashierId});
  });
});