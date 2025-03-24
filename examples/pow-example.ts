/**
 * Proof of Work (PoW) Blockchain Example
 *
 * This example demonstrates various use cases of the PoW blockchain implementation,
 * including mining, transaction processing, and chain validation.
 */

import { PoWChain } from '../src/blockchain-pow';

// Example 1: Basic Mining and Block Creation
function basicMiningExample() {
    console.log('\n=== Basic Mining Example ===');

    // Get the blockchain instance
    const chain = PoWChain.getInstance();

    // Create and mine some blocks
    for (let i = 0; i < 3; i++) {
        // Mine a new block
        chain.mine(i);

        console.log(`\nBlock ${i + 1} mined:`);
        console.log(`Hash: ${chain.lastBlock.hash}`);
        console.log(`Previous Hash: ${chain.lastBlock.prevHash}`);
        console.log(`Nonce: ${chain.lastBlock.nonce}`);
        console.log(`Timestamp: ${new Date(chain.lastBlock.ts).toISOString()}`);
        console.log(`Transaction: ${chain.lastBlock.transaction.toString()}`);
    }

    // Display chain information
    console.log(`\nChain length: ${chain.chainLength}`);
    console.log(`Last block hash: ${chain.lastBlock.hash}`);
}

// Example 2: Mining Difficulty and Hash Rate
function miningDifficultyExample() {
    console.log('\n=== Mining Difficulty Example ===');

    const chain = PoWChain.getInstance();
    chain.reset(); // Reset for clean example

    // Create blocks with different nonce values
    const nonces = [0, 1000, 2000];

    nonces.forEach((nonce) => {
        console.log(`\nMining with nonce: ${nonce}`);
        const startTime = Date.now();

        // Mine a block
        chain.mine(nonce);

        const endTime = Date.now();
        const miningTime = (endTime - startTime) / 1000; // Convert to seconds

        console.log(`Block mined:`);
        console.log(`Hash: ${chain.lastBlock.hash}`);
        console.log(`Nonce: ${chain.lastBlock.nonce}`);
        console.log(`Mining time: ${miningTime.toFixed(2)} seconds`);
        console.log(
            `Hash rate: ${(chain.lastBlock.nonce / miningTime).toFixed(2)} hashes/second`
        );
    });
}

// Example 3: Transaction Processing and Validation
function transactionProcessingExample() {
    console.log('\n=== Transaction Processing Example ===');

    const chain = PoWChain.getInstance();
    chain.reset();

    // Create transactions
    const transactions = [
        { amount: 50, payer: 'genesis', payee: 'alice' },
        { amount: 20, payer: 'alice', payee: 'bob' },
    ];

    // Add blocks with transactions
    transactions.forEach((tx, index) => {
        chain.mine(index);
        console.log(`\nBlock ${index + 1} added:`);
        console.log(
            `Transaction: ${tx.amount} from ${tx.payer} to ${tx.payee}`
        );
    });

    // Display transaction history
    console.log('\nTransaction History:');
    for (let i = 0; i < chain.chainLength; i++) {
        const block = chain.lastBlock;
        console.log(`\nBlock ${i}:`);
        console.log(`Transaction: ${block.transaction.toString()}`);
    }
}

// Example 4: Chain Validation and Fork Detection
function chainValidationExample() {
    console.log('\n=== Chain Validation Example ===');

    const chain = PoWChain.getInstance();
    chain.reset();

    // Mine some blocks
    for (let i = 0; i < 3; i++) {
        chain.mine(i);
    }

    // Create a fork by mining with different nonce
    chain.mine(9999);

    // Validate the chain
    console.log('\nChain Validation:');
    for (let i = 1; i < chain.chainLength; i++) {
        const currentBlock = chain.lastBlock;
        const prevBlock = chain.lastBlock;

        console.log(`\nValidating Block ${i}:`);
        console.log(`Hash: ${currentBlock.hash}`);
        console.log(`Previous Hash: ${currentBlock.prevHash}`);
        console.log(`Valid Hash: ${currentBlock.hash.startsWith('0')}`);
        console.log(
            `Links to Previous: ${currentBlock.prevHash === prevBlock.hash}`
        );
    }
}

// Example 5: Mining Competition Simulation
function miningCompetitionExample() {
    console.log('\n=== Mining Competition Simulation ===');

    const chain = PoWChain.getInstance();
    chain.reset();

    // Create multiple miners with different hash rates
    const miners = [
        { name: 'Fast Miner', nonceStep: 1000 },
        { name: 'Medium Miner', nonceStep: 500 },
        { name: 'Slow Miner', nonceStep: 100 },
    ].map((miner) => ({
        ...miner,
        blocksMined: 0,
    }));

    // Simulate mining competition
    const totalBlocks = 10;
    for (let i = 0; i < totalBlocks; i++) {
        // Simulate mining time based on nonce step
        const miningTimes = miners.map((miner) => ({
            miner,
            time: Math.random() * (1000 / miner.nonceStep),
        }));

        // Find the fastest miner
        const winner = miningTimes.reduce((fastest, current) =>
            current.time < fastest.time ? current : fastest
        ).miner;

        // Winner mines the block
        chain.mine(i * winner.nonceStep);
        winner.blocksMined++;

        console.log(`\nBlock ${i + 1} mined by: ${winner.name}`);
        console.log(`Hash: ${chain.lastBlock.hash}`);
        console.log(`Nonce: ${chain.lastBlock.nonce}`);
    }

    // Display mining statistics
    console.log('\nMining Statistics:');
    miners.forEach((miner) => {
        const percentage = (miner.blocksMined / totalBlocks) * 100;
        console.log(`${miner.name}:`);
        console.log(`  Blocks mined: ${miner.blocksMined}`);
        console.log(`  Mining share: ${percentage.toFixed(1)}%`);
    });
}

// Run all examples
console.log('Starting PoW Blockchain Examples...');
basicMiningExample();
miningDifficultyExample();
transactionProcessingExample();
chainValidationExample();
miningCompetitionExample();
