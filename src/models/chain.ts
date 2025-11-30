import * as crypto from 'crypto';
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
        // Verify that the sender's public key matches the transaction payer
        if (transaction.payer !== senderPublicKey) {
            throw new Error(
                'Transaction payer does not match the provided sender public key'
            );
        }

        // Verify the transaction signature
        const verify = crypto.createVerify('SHA256');
        verify.update(transaction.toString()).end();
        const isValid = verify.verify(senderPublicKey, signature as Uint8Array);

        if (!isValid) {
            throw new Error('Invalid transaction signature');
        }

        const newBlock = new Block(this.lastBlock.hash, transaction);
        this.chain.push(newBlock);
    }
}
