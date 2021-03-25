import { Request } from "express";
import { Pool } from 'pg';
import { ICashier } from './model';
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	user: process.env.DB_USER,
	password: process.env.DB_PWD,
	database: process.env.DB_NAME,
});

export async function getTargetCashiers1(shopId: number) {
/* Вертає усіх касирів магазину за всю історію роботи магазинів ATB у місті Львів,
 які мають більше 5 років досвіду та раніше працювали у Silpo або Arsen */
    await pool.query(`
select distinct atb.Name, atb.Email, atb.yearsOfExperience from (
	select distinct c2s.startDate, c.Email, c.id, c.Name, cashierExperience.yearsOfExperience from cashiers2shops as c2s
		left join cashiers as c
			on c2s.Cashier = c.id
		left join (
			select cashier, sum(enddate - startdate)/365 as yearsOfExperience from cashiers2shops
				group by cashiers2shops.cashier) as cashierExperience
			on c2s.Cashier = cashierExperience.cashier
		where c2s.shop in (select id from shops
			where shops.id = $1) and cashierExperience.yearsOfExperience > 5
		) as atb
inner join (
	select distinct c2s.startDate, c.id from cashiers2shops as c2s
		left join cashiers as c
			on c2s.Cashier = c.id
		where c2s.shop in (
			select id from shops
				where name = 'Arsen' or name = 'Silpo')) as other
	on atb.id = other.id and other.startDate <= atb.startDate`, [shopId])
	.then(res => {
		console.log("getTargetCashiers1");
		console.table(res.rows);
	})
	.catch(err => console.log('Database query error: ' + err.message));
}

export async function getTargetCashiers2() {
/* Вертає усіх касирів магазину ATB за адресою Шевенка 100,
 які працюють на касах з непарним числом щопонеділка у нічну зміну (23:00 - 07:00) */
    await pool.query(`
select cs.name, cs.Email from work_shifts as ws
	left join (
		select reg.id, cd2s.Number from cash_registers as reg
			left join cash_desks2shops as cd2s
				on reg.id = cd2s.CashRegister) as regNum
		on ws.CashRegister = regNum.id
	left join cashiers as cs
		on cs.id = ws.Cashier
where Shop = 1 and (select extract(isodow from Date) = 1) and WorkShiftType = 3 and regNum.Number % 2 > 0`)
	.then(res => {
		console.log("getTargetCashiers2");
		console.table(res.rows);
	})
	.catch(err => console.log('Database query error: ' + err.message));
}

export async function getAllCashiers() {
 	await pool.query("select name, email, dateOfBirth from cashiers")
	.then(res => {
		console.log("List of cashiers");
		console.table(res.rows)
	})
	.catch(err => console.log('Database query error: ' + err.message));
}

async function makeRequest(req: string, callback: Function, ...theArgs: any[]) {
	await pool.query(req, theArgs, (err, result) => {
		callback(err, result?.command == "SELECT"? result.rows: result?.rowCount)
	})
}

export async function getCashier(callback: Function, rq: Request) {
	let req: string = "select name, email from cashiers as c",
		whereClause: string[] = [],
		filter = rq.query;
	for (let key in filter) {
		switch (key) {
			case "age":
				req += `
					left join (
						select id, (CURRENT_DATE - DateOfBirth)/365 as age from cashiers
						) as ageFilter
					on c.id = ageFilter.id
					`;
				whereClause.push(`ageFilter.age ${filter[key]}`);
				break;
			case "shifts":
				req += `
					right join (
						select distinct Cashier from work_shifts
						where WorkShiftType ${filter[key]}
						) as work_shiftsFilter
					on c.id = work_shiftsFilter.Cashier
					`;
				break;
			case "exp":
				req += `
					left join (
						select cashier, sum(enddate - startdate)/365 as experience from cashiers2shops
							group by cashiers2shops.cashier) as experienceFilter
						on c.id = experienceFilter.cashier
					`;
				whereClause.push(`experienceFilter.experience ${filter[key]}`);
				break;
			default:
				whereClause.push(`${key} ${filter[key]}`);
		}
	}
	if (whereClause.length)
		req += " where " + whereClause.join(' and ');
	console.log(req)
	await pool.query(req, (err, result) => { callback(err, result?.rows) })
}

export async function createCashier(cashier: ICashier, callback: Function) {
	makeRequest("INSERT INTO cashiers (name, email) VALUES ($1, $2)", callback, cashier.name, cashier.email);
}

export async function updateCashier(cashier: ICashier, callback: Function, id:number) {
	makeRequest("UPDATE cashiers SET name = $1, email = $2 where id = $3", callback, cashier.name, cashier.email, id);
}

export async function deleteCashier(id: number, callback: Function) {
	makeRequest("DELETE FROM cashiers where id = $1", callback, id);
}