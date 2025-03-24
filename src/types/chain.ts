import { IBlock } from './block';
import { ITransaction } from './transaction';

export interface IChain {
    lastBlock: IBlock;
    chainLength: number;
    mine(nonce: number): void;
    addBlock(
        transaction: ITransaction,
        senderPublicKey: string,
        signature: Buffer
    ): void;
    reset(): void;
}
