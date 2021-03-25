// где тут применить enum не смог придумать
export interface ICashier {
	name: string,
	email: string,
	dateOfBirth: Date,
	gender: string,
	yearsOfExperience?: number
}
// нигде не используется - было в задании
interface IShop {
	name: string,
	address: string,
	ATBNetwork?: boolean
}
// нигде не используется - было в задании
interface ICashRegister {
	id: number
}