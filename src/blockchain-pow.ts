/**
 * Proof of Work (PoW) Blockchain Implementation
 *
 * This implementation extends the base Chain class to add Proof of Work functionality.
 * In PoW, miners must solve a computationally expensive puzzle to add new blocks.
 * The difficulty of the puzzle is adjusted to maintain a target block time.
 */

import { Transaction, Block, Chain } from './models';

export class PoWChain extends Chain {
    private difficulty: number = 4; // Number of leading zeros required in hash

    protected constructor() {
        super();
    }

    /**
     * Gets the singleton instance of PoWChain
     * @returns The PoWChain instance
     */
    public static getInstance(): PoWChain {
        if (!Chain.instance) {
            Chain.instance = new PoWChain();
        }
        return Chain.instance as PoWChain;
    }

    /**
     * Mines a new block by finding a nonce that satisfies the difficulty requirement
     * @param nonce - The starting nonce value for mining
     */
    mine(nonce: number): void {
        const block = new Block(
            this.lastBlock.hash,
            new Transaction(50, 'genesis', 'satoshi')
        );
        block.nonce = nonce;
        block.mine(this.difficulty);

        console.log('Block mined!');
        this.chain.push(block);
    }

    /**
     * Sets the mining difficulty (number of leading zeros required in block hash)
     * @param difficulty - The new difficulty value
     */
    setDifficulty(difficulty: number): void {
        this.difficulty = difficulty;
    }

    /**
     * Gets the current mining difficulty
     * @returns The current difficulty value
     */
    getDifficulty(): number {
        return this.difficulty;
    }
}
