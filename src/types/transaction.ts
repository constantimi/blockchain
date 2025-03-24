export interface ITransaction {
    amount: number; // amount of the transaction denominated in bitcoin
    payer: string; // person paying the money
    payee: string; // person receiving the money
    toString(): string;
}
