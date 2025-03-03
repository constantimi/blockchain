// Import necessary libraries
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
}

// Define the structure of a block in the blockchain
class Blockchain {
    chain: Block[];
    difficulty: number;
    pendingTransactions: Transaction[];
    miningReward: number;

    // Constructor to initialize blockchain parameters
    constructor() {
        this.chain = [];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
        // Genesis block
        this.createBlock([], '');
    }

    // Function to create a new block
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

    // Function to get the latest block in the chain
    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    // Function to mine pending transactions
    minePendingTransactions(miningRewardAddress: string): void {
        const rewardTransaction: Transaction = {
            fromAddress: '',
            toAddress: miningRewardAddress,
            amount: this.miningReward,
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

    // Function to add a new transaction to the pending transactions list
    addTransaction(transaction: Transaction): void {
        this.pendingTransactions.push(transaction);
    }

    // Function to calculate the hash of a block
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

    // Function to check if a block is valid
    isValidBlock(block: Block): boolean {
        if (block.index === 1) return true; // Genesis block

        const previousBlock = this.chain[block.index - 2];
        return (
            block.previousHash === previousBlock.hash &&
            block.hash === this.calculateHash(block)
        );
    }

    // Function to check if the whole chain is valid
    isValidChain(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            if (!this.isValidBlock(this.chain[i])) return false;
        }
        return true;
    }
}

// Example of usage
const myBlockchain = new Blockchain();
myBlockchain.addTransaction({
    fromAddress: 'User1',
    toAddress: 'User2',
    amount: 50,
});
myBlockchain.addTransaction({
    fromAddress: 'User2',
    toAddress: 'User1',
    amount: 20,
});

console.log('Mining...');
myBlockchain.minePendingTransactions('User1');

console.log('Balance of User1:', myBlockchain.chain[1].data[0].amount);
console.log('Balance of User2:', myBlockchain.chain[1].data[1].amount);
