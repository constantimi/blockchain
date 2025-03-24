/**
 * Proof of Stake (PoS) Blockchain Implementation
 *
 * This implementation provides a Proof of Stake consensus mechanism where validators
 * are selected to create new blocks based on their stake in the network.
 * The probability of being selected as a validator is proportional to the amount staked.
 */

import * as crypto from 'crypto';

/**
 * Represents a validator in the PoS network
 */
export class Validator {
    constructor(
        public name: string,
        public stake: number
    ) {}

    /**
     * Gets the validator's weight (stake) for block selection
     * @returns The validator's stake amount
     */
    get weight(): number {
        return this.stake;
    }
}

/**
 * Represents a block in the PoS blockchain
 */
export class PoSBlock {
    constructor(
        public prevHash: string,
        public validator: Validator,
        public timestamp: number = Date.now()
    ) {}

    /**
     * Generates a SHA-256 hash of the block
     * @returns The block's hash as a hexadecimal string
     */
    get hash(): string {
        const str = JSON.stringify(this);
        const hash = crypto.createHash('SHA256');
        hash.update(str).end();
        return hash.digest('hex');
    }
}

/**
 * Main PoS blockchain implementation
 */
export class PoSChain {
    private static instance: PoSChain | null = null;
    private chain: PoSBlock[];
    private validators: Validator[] = [];

    private constructor() {
        this.chain = [new PoSBlock('0', new Validator('genesis', 100))];
    }

    /**
     * Gets the singleton instance of PoSChain
     * @returns The PoSChain instance
     */
    public static getInstance(): PoSChain {
        if (!PoSChain.instance) {
            PoSChain.instance = new PoSChain();
        }
        return PoSChain.instance;
    }

    /**
     * Resets the singleton instance (useful for testing)
     */
    public static reset(): void {
        PoSChain.instance = null;
    }

    /**
     * Resets the current instance
     */
    public reset(): void {
        PoSChain.reset();
    }

    /**
     * Gets the last block in the chain
     * @returns The last block
     */
    get lastBlock(): PoSBlock {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Gets the current length of the chain
     * @returns The number of blocks in the chain
     */
    get chainLength(): number {
        return this.chain.length;
    }

    /**
     * Adds a new validator to the network
     * @param validator - The validator to add
     */
    addValidator(validator: Validator): void {
        this.validators.push(validator);
    }

    /**
     * Selects a validator based on their stake
     * @returns The selected validator
     */
    selectValidator(): Validator {
        const totalStake = this.validators.reduce((sum, v) => sum + v.stake, 0);
        let random = Math.random() * totalStake;

        for (const validator of this.validators) {
            random -= validator.stake;
            if (random <= 0) return validator;
        }

        return this.validators[0];
    }

    /**
     * Adds a new block to the chain
     * @param validator - The validator that created the block
     */
    addBlock(validator: Validator): void {
        const block = new PoSBlock(this.lastBlock.hash, validator);
        this.chain.push(block);
    }
}
