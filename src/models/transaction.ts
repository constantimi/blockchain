import { ITransaction } from '../types/transaction';

export class Transaction implements ITransaction {
    constructor(
        public amount: number, // amount of the transaction denominated in bitcoin
        public payer: string, // person paying the money
        public payee: string // person receiving the money
    ) {}

    toString(): string {
        return JSON.stringify(this);
    }
}
