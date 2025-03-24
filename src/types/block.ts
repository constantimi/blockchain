import { ITransaction } from './transaction';

export interface IBlock {
    prevHash: string; // link to the previous block
    transaction: ITransaction;
    ts: number; // timestamp
    nonce: number; // proof of work nonce
    hash: string; // block hash
    mine(difficulty: number): void;
}
