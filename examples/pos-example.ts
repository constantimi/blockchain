/**
 * Proof of Stake (PoS) Blockchain Example
 *
 * This example demonstrates various use cases of the PoS blockchain implementation,
 * including validator management, block creation, and stake-based consensus.
 */

import { PoSChain, Validator } from '../src/blockchain-pos.js';

// Example 1: Basic Validator Setup and Block Creation
function basicPosExample() {
    console.log('\n=== Basic PoS Example ===');

    // Create validators with different stakes
    const validators = [
        new Validator('Alice', 1000),
        new Validator('Bob', 2000),
        new Validator('Charlie', 3000),
    ];

    // Get the PoS chain instance
    const chain = PoSChain.getInstance();

    // Add validators to the network
    validators.forEach((validator) => {
        chain.addValidator(validator);
        console.log(
            `Added validator: ${validator.name} with stake: ${validator.stake}`
        );
    });

    // Create some blocks with selected validators
    for (let i = 0; i < 5; i++) {
        const selectedValidator = chain.selectValidator();
        chain.addBlock(selectedValidator);
        console.log(
            `Block ${i + 1} created by validator: ${selectedValidator.name}`
        );
    }

    // Display chain information
    console.log(`\nChain length: ${chain.chainLength}`);
    console.log(`Last block hash: ${chain.lastBlock.hash}`);
    console.log(`Last block validator: ${chain.lastBlock.validator.name}`);
}

// Example 2: Stake Distribution and Validator Selection
function stakeDistributionExample() {
    console.log('\n=== Stake Distribution Example ===');

    const chain = PoSChain.getInstance();
    chain.reset(); // Reset for clean example

    // Create validators with varying stakes
    const validators = [
        new Validator('Small Stake', 100),
        new Validator('Medium Stake', 500),
        new Validator('Large Stake', 1000),
    ];

    validators.forEach((v) => chain.addValidator(v));

    // Simulate block creation and track validator selection
    const selectionCount = new Map<string, number>();
    const totalBlocks = 100;

    for (let i = 0; i < totalBlocks; i++) {
        const validator = chain.selectValidator();
        chain.addBlock(validator);
        selectionCount.set(
            validator.name,
            (selectionCount.get(validator.name) || 0) + 1
        );
    }

    // Display selection statistics
    console.log('\nValidator Selection Statistics:');
    selectionCount.forEach((count, name) => {
        const percentage = (count / totalBlocks) * 100;
        console.log(`${name}: ${count} blocks (${percentage.toFixed(1)}%)`);
    });
}

// Example 3: Chain Validation and Block Verification
function chainValidationExample() {
    console.log('\n=== Chain Validation Example ===');

    const chain = PoSChain.getInstance();
    chain.reset();

    // Create validators
    const validators = [
        new Validator('Validator1', 1000),
        new Validator('Validator2', 1000),
    ];
    validators.forEach((v) => chain.addValidator(v));

    // Create a series of blocks
    for (let i = 0; i < 3; i++) {
        const validator = chain.selectValidator();
        chain.addBlock(validator);
    }

    // Verify chain integrity
    console.log('\nChain Verification:');
    for (let i = 1; i < chain.chainLength; i++) {
        const currentBlock = chain.lastBlock;
        const prevBlock = chain.lastBlock;
        console.log(`Block ${i}:`);
        console.log(`  Hash: ${currentBlock.hash}`);
        console.log(`  Previous Hash: ${currentBlock.prevHash}`);
        console.log(`  Validator: ${currentBlock.validator.name}`);
        console.log(
            `  Timestamp: ${new Date(currentBlock.timestamp).toISOString()}`
        );
        console.log(
            `  Links to Previous: ${currentBlock.prevHash === prevBlock.hash}`
        );
        console.log('---');
    }
}

// Run all examples
console.log('Starting PoS Blockchain Examples...');
basicPosExample();
stakeDistributionExample();
chainValidationExample();
