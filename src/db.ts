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
	.then(res => console.table(res.rows))
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
	.then(res => console.table(res.rows))
	.catch(err => console.log('Database query error: ' + err.message));
}

export async function getAllCashiers() {
 	await pool.query("select name, email from cashiers")
	.then(res => console.table(res.rows))
	.catch(err => console.log('Database query error: ' + err.message));
}

async function makeRequest(req: string, callback: Function, ...theArgs: any[]) {
	await pool.query(req, theArgs, (err, result) => { callback(err, result?.rows) })
}

export function getCashier(callback: Function, cashierId: number) {
	makeRequest("select name, email from cashiers where id = $1", callback, cashierId);
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