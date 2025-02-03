import * as crypto from 'crypto';

// Define the structure of a block
interface Block {
    index: number;
    timestamp: number;
    data: any;
    previousHash: string;
    hash: string;
    nonce: number;
}

// Define the structure of a transaction
interface Transaction {
    fromAddress: string;
    toAddress: string;
    amount: number;
    type: 'swap' | 'addLiquidity';
    token: 'TokenA' | 'TokenB'; // Which token is involved in the transaction
}

// Define the structure of a block in the blockchain
class Blockchain {
    chain: Block[];
    difficulty: number;
    pendingTransactions: Transaction[];
    miningReward: number;

    constructor() {
        this.chain = [];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
        // Genesis block
        this.createBlock([], '');
    }

    createBlock(transactions: Transaction[], previousHash: string): Block {
        const block: Block = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            data: transactions,
            previousHash: previousHash,
            hash: '',
            nonce: 0,
        };
        block.hash = this.calculateHash(block);
        this.chain.push(block);
        return block;
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress: string): void {
        const rewardTransaction: Transaction = {
            fromAddress: '',
            toAddress: miningRewardAddress,
            amount: this.miningReward,
            type: 'swap', // Mining reward is treated like a swap transaction
            token: 'TokenA', // Example token for the reward
        };
        this.pendingTransactions.push(rewardTransaction);

        const previousHash = this.getLatestBlock().hash;
        const newBlock = this.createBlock(
            this.pendingTransactions,
            previousHash
        );
        this.pendingTransactions = [];
        console.log('Block mined: ', newBlock);
    }

    addTransaction(transaction: Transaction): void {
        this.pendingTransactions.push(transaction);
    }

    calculateHash(block: Block): string {
        return crypto
            .createHash('sha256')
            .update(
                block.index +
                    block.previousHash +
                    JSON.stringify(block.data) +
                    block.timestamp +
                    block.nonce
            )
            .digest('hex');
    }

    isValidBlock(block: Block): boolean {
        if (block.index === 1) return true; // Genesis block

        const previousBlock = this.chain[block.index - 2];
        return (
            block.previousHash === previousBlock.hash &&
            block.hash === this.calculateHash(block)
        );
    }

    isValidChain(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            if (!this.isValidBlock(this.chain[i])) return false;
        }
        return true;
    }
}

// Define the structure of a liquidity pool
class LiquidityPool {
    tokenAReserve: number;
    tokenBReserve: number;
    k: number;
    feeRate: number; // Transaction fee rate, e.g., 0.003 for 0.3%

    constructor(
        initialTokenA: number,
        initialTokenB: number,
        feeRate: number = 0.003
    ) {
        this.tokenAReserve = initialTokenA;
        this.tokenBReserve = initialTokenB;
        this.k = initialTokenA * initialTokenB;
        this.feeRate = feeRate; // Fee rate initialization
    }

    // Add liquidity to the pool
    addLiquidity(amountA: number, amountB: number): void {
        this.tokenAReserve += amountA;
        this.tokenBReserve += amountB;
        this.k = this.tokenAReserve * this.tokenBReserve; // Recalculate k
        console.log(
            `Liquidity added. New reserves: A = ${this.tokenAReserve}, B = ${this.tokenBReserve}`
        );
    }

    // Swap TokenA for TokenB with fee
    swapTokenAForTokenB(amountA: number): number {
        const fee = amountA * this.feeRate; // Calculate fee
        const amountAAfterFee = amountA - fee; // Amount after deducting the fee

        const newTokenAReserve = this.tokenAReserve + amountAAfterFee;
        const newTokenBReserve = this.k / newTokenAReserve;

        const amountB = this.tokenBReserve - newTokenBReserve;
        if (amountB <= 0) {
            throw new Error('Insufficient liquidity');
        }

        this.tokenAReserve = newTokenAReserve;
        this.tokenBReserve = newTokenBReserve;

        console.log(
            `Swapped ${amountA} TokenA for ${amountB} TokenB with fee of ${fee}`
        );
        console.log(`Fee of ${fee} added to liquidity pool`);

        return amountB;
    }

    // Swap TokenB for TokenA with fee
    swapTokenBForTokenA(amountB: number): number {
        const fee = amountB * this.feeRate; // Calculate fee
        const amountBAfterFee = amountB - fee; // Amount after fee

        const newTokenBReserve = this.tokenBReserve + amountBAfterFee;
        const newTokenAReserve = this.k / newTokenBReserve;

        const amountA = this.tokenAReserve - newTokenAReserve;
        if (amountA <= 0) {
            throw new Error('Insufficient liquidity');
        }

        this.tokenAReserve = newTokenAReserve;
        this.tokenBReserve = newTokenBReserve;

        console.log(
            `Swapped ${amountB} TokenB for ${amountA} TokenA with fee of ${fee}`
        );
        console.log(`Fee of ${fee} added to liquidity pool`);

        return amountA;
    }

    // Impermanent loss calculation after a swap
    calculateImpermanentLoss(): number {
        // Before the swap, the ratio of TokenA and TokenB prices
        const priceBefore = this.tokenBReserve / this.tokenAReserve;

        // After the swap, the ratio of TokenA and TokenB prices
        const priceAfter = this.tokenBReserve / this.tokenAReserve;

        // Calculate the impermanent loss factor (ILF) using the formula
        const impermanentLossFactor =
            2 * Math.sqrt(priceAfter / priceBefore) - 1;
        return impermanentLossFactor;
    }
}

// Example of usage with Blockchain and Liquidity Pool
const myBlockchain = new Blockchain();

// Initialize liquidity pool with initial reserves and a 0.3% fee
const liquidityPool = new LiquidityPool(1000, 1000, 0.003); // 0.3% fee rate

// LP adds liquidity to the pool
liquidityPool.addLiquidity(500, 500); // LP adds 500 TokenA and 500 TokenB

// Simulate the state before the transaction
console.log('Liquidity Pool State before swap:');
console.log('TokenA Reserve:', liquidityPool.tokenAReserve);
console.log('TokenB Reserve:', liquidityPool.tokenBReserve);

// User1 swaps 100 TokenA for TokenB, fee will be deducted
const amountReceivedByUser1 = liquidityPool.swapTokenAForTokenB(100); // 100 TokenA for TokenB
console.log(`User1 received ${amountReceivedByUser1} TokenB`);

// Record transactions on the blockchain
myBlockchain.addTransaction({
    fromAddress: 'User1',
    toAddress: 'LiquidityPool',
    amount: 100,
    type: 'swap',
    token: 'TokenA',
});

myBlockchain.addTransaction({
    fromAddress: 'LiquidityPool',
    toAddress: 'User1',
    amount: amountReceivedByUser1,
    type: 'swap',
    token: 'TokenB',
});

// Mining to confirm and add the block with transactions to the blockchain
console.log('Mining...');
myBlockchain.minePendingTransactions('User1');

// Check blockchain transactions
console.log('Blockchain Transactions after mining:');
console.log(myBlockchain.chain[1].data); // Show details of the block

// Check User1's balance in the blockchain (amount received after swap)
const user1Transaction = myBlockchain.chain[1].data.find(
    (tx: Transaction) => tx.toAddress === 'User1' && tx.token === 'TokenB'
);
console.log('User1 received:', user1Transaction?.amount);

// Liquidity Pool state after the swap
console.log('Liquidity Pool State after swap:');
console.log('TokenA Reserve:', liquidityPool.tokenAReserve);
console.log('TokenB Reserve:', liquidityPool.tokenBReserve);

// Impermanent Loss calculation after a swap
const impermanentLoss = liquidityPool.calculateImpermanentLoss();
console.log('Impermanent Loss factor:', impermanentLoss);
