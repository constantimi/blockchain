import * as crypto from 'crypto';
import { IBlock } from '../types/block.js';
import { ITransaction } from '../types/transaction.js';

export class Block implements IBlock {
    public nonce = Math.round(Math.random() * 999999999);

    constructor(
        public prevHash: string, // link to the previous block
        public transaction: ITransaction,
        public ts = Date.now()
    ) {}

    get hash(): string {
        const str = JSON.stringify(this);
        const hash = crypto.createHash('SHA256'); // hash functions which can't return the same value
        hash.update(str).end();
        return hash.digest('hex');
    }

    mine(difficulty: number): void {
        while (
            this.hash.substring(0, difficulty) !==
            Array(difficulty + 1).join('0')
        ) {
            this.nonce++;
        }
        console.log('Block mined: ' + this.hash);
    }
}
