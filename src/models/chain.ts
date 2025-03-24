import { IChain } from '../types/chain';
import { IBlock } from '../types/block';
import { ITransaction } from '../types/transaction';
import { Block } from './block';
import { Transaction } from './transaction';

export class Chain implements IChain {
    protected static instance: Chain | null = null;
    protected chain: IBlock[];

    protected constructor() {
        this.chain = [
            // Genesis block
            new Block('0', new Transaction(100, 'genesis', 'satoshi')),
        ];
    }

    public static getInstance(): IChain {
        if (!Chain.instance) {
            Chain.instance = new Chain();
        }
        return Chain.instance;
    }

    public static reset(): void {
        Chain.instance = null;
    }

    public reset(): void {
        Chain.reset();
    }

    get lastBlock(): IBlock {
        return this.chain[this.chain.length - 1];
    }

    get chainLength(): number {
        return this.chain.length;
    }

    mine(nonce: number): void {
        const block = new Block(
            this.lastBlock.hash,
            new Transaction(50, 'genesis', 'satoshi')
        );
        block.mine(nonce);

        console.log('Block mined!');
        this.chain.push(block);
    }

    addBlock(
        transaction: ITransaction,
        senderPublicKey: string,
        signature: Buffer
    ): void {
        const newBlock = new Block(this.lastBlock.hash, transaction);
        this.chain.push(newBlock);
    }
}
